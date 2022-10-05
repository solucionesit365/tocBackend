import axios from 'axios';
import {SocketGateway} from '../sockets.gateway';
import {movimientosInstance} from '../movimientos/movimientos.clase';
import {parametrosInstance} from 'src/parametros/parametros.clase';
import {trabajadoresInstance} from 'src/trabajadores/trabajadores.clase';
import {ticketsInstance} from 'src/tickets/tickets.clase';
import {cestasInstance} from 'src/cestas/cestas.clase';
import {TicketsInterface} from 'src/tickets/tickets.interface';
import {CestasInterface} from 'src/cestas/cestas.interface';
import {transaccionesInstance} from 'src/transacciones/transacciones.class';
import {nuevoTicket} from 'src/tickets/tickets.mongodb';
import {UtilesModule} from 'src/utiles/utiles.module';
import {LogsClass} from 'src/logs/logs.class';
import {TransaccionesInterface} from 'src/transacciones/transacciones.interface';
import {Socket} from 'dgram';
import {Respuesta} from './paytef.interface';

function limpiarNombreTienda(cadena: string) {
  const devolver = Number(cadena.replace(/\D/g, ''));
  if (isNaN(devolver) == false) {
    return devolver;
  } else {
    return 0;
  }
}

class PaytefClass {
  /* Parámetros de entrada OK */
  async iniciarTransaccion(client: Socket, idCliente: string, idCesta:number, idTrabajador: number, idTicket: TicketsInterface["_id"], total: number): Promise<void> {
    try {
      this.iniciarDatafono(idTicket, total, client, cesta._id, idTrabajador);
    } catch (err) {
      this.cancelarOperacion();
      client.emit('consultaPaytef', {error: true, mensaje: err.message});
    }
  }

  /* Cancela la operación en el propio datáfono */
  async cancelarOperacion(): Promise<void> {
    const params = await parametrosInstance.getParametros();
    axios.post(`http://${params.ipTefpay}:8887/pinpad/cancel`, {'pinpad': '*'});
  }

  /* Anula el ticket creado (por algún error). NO detiene el ciclo (sin respuesta al cliente) */
  anularOperacion(idTicket: number, msj = '') {
    ticketsInstance.borrarTicket(idTicket).then((resAnulacion) => {
      if (resAnulacion == false) {
        LogsClass.newLog('Error nuevo grave', `Ticket debía ser borrado pero no se ha podido: idTicket: ${idTicket} tiemstamp: ${Date.now()} y viene de ${msj}`);
      }
    }).catch((err) => {
      console.log(err);
      LogsClass.newLog('Traza paytef', `anularOperacion(${idTicket}, client, msj) entra en su catch. timestamp ${Date.now()} y otra vez el idTicket: ${idTicket}`);
    });
  }

  async iniciarDatafono(idTicket: number, total: number, client: Socket, idTrabajador: number) {
    const params = await parametrosInstance.getParametros();
    if (UtilesModule.checkVariable(params.ipTefpay)) {
      axios.post(`http://${params.ipTefpay}:8887/transaction/start`, {
        pinpad: '*',
        opType: 'sale',
        createReceipt: true,
        executeOptions: {
          method: 'polling',
        },
        language: 'es',
        requestedAmount: Math.round(total*100),
        requireConfirmation: false,
        transactionReference: idTicket,
        showResultSeconds: 5,
      }).then((respuestaPaytef: any) => {
        if (respuestaPaytef.data.info.started) {
          // Arranca el ciclo de comprobaciones
          this.consultarEstadoOperacion(client, idTicket, total, idTrabajador);
        } else {
          throw Error("La operación no ha podido iniciar");
        }
      }).catch((err) => {
        this.cancelarOperacion();
        this.anularOperacion(idTicket, 'Backend: ' + err.message);
        client.emit('consultaPaytef', {
          error: false,
          mensaje: "Backend: " + err.message,
        });
      });
    } else {
      this.anularOperacion(idTicket, "IP TefPay no definida, contacta con informática");
      client.emit("consultaPaytef", {
        error: true,
        mensaje: "Backend: IP TefPay no definida, contacta con informática",
      });
    }
  }

  /* Función recursiva y asíncrona */
  async consultarEstadoOperacion(client: Socket, idTicket: number, total: number, idTrabajador: number): Promise<void> {
    try {
      const ipDatafono = (await parametrosInstance.getParametros()).ipTefpay;
      const resEstadoPaytef: any = await axios.post(`http://${ipDatafono}:8887/transaction/poll`, {
        pinpad: "*"
      });

      /* ¿Ya existe el resultado de PayTef? */
      if (UtilesModule.checkVariable(resEstadoPaytef.data.result)) {
        if (Number(resEstadoPaytef.data.result.transactionReference) == idTicket) {
          if (resEstadoPaytef.data.result.approved) {
            // ticketsInstance.desbloquearTicket(idTicket);
            movimientosInstance.nuevaSalida(total, 'Targeta', 'TARJETA', false, idTicket, idTrabajador);
            // await cestasInstance.borrarCesta(idCesta);
            client.emit('consultaPaytef', { // Operación aprobada. Todo OK
              error: false,
            });
          } else {
            throw Error("Operación denegada por PayTef");
          }
        } else if (resEstadoPaytef.data.result.approved) {
          LogsClass.newLog('Error nuevo (sin referencia)', `Ticket aprobado por PayTef y creado en el toc, pero no coincide la referencia: referenciaPaytef: ${Number(resEstadoPaytef.data.result.transactionReference)} idTicketFuncion: ${idTicket} timestamp: ${Date.now()}`);
          ticketsInstance.desbloquearTicket(idTicket);
          movimientosInstance.nuevaSalida(total, 'Targeta', 'TARJETA', false, idTicket, idTrabajador);
          await cestas.borrarCesta(idCesta);
          client.emit('consultaPaytef', { // Operación aprobada. Todo OK
            error: false,
          });
        } else {
          throw Error("Operación denegada por PayTef. 2");
        }
      } else { // Aún no existe el resultado, pero sí el estado del datáfono
          switch (resEstadoPaytef.data.info.transactionStatus) {
            case "cancelling": throw Error("Operación cancelada"); break;
            case "none":
            case "starting":
            case "waitingForUser":
            case "dcc":
            case "signature":
            case "processing":
            case "waitingConfirmation":
            case "finished":
              await new Promise((r) => setTimeout(r, 1000));
              this.consultarEstadoOperacion(client, idTicket, total, idCesta, idTrabajador); break;
            default:
              LogsClass.newLog("warning importante", `¡info.transactionStatus: (${resEstadoPaytef.data.info.transactionStatus}) no tiene ningún valor de la documentación! - idTicket: ${idTicket} timestamp: ${Date.now()}`);
              throw Error("¡No existe info en PayTef! Ver log warning importante");
          }
        }
    } catch (err) {
      this.cancelarOperacion();
      this.anularOperacion(idTicket, err.message);
      LogsClass.newLog("Error backend paytefClass consultarEstadoOperacion", err.message);
      client.emit("consultaPaytef", {
        error: true,
        mensaje: "Backend: " + err.message
      });
    }
  }
}

const paytefInstance = new PaytefClass();
export {paytefInstance};
