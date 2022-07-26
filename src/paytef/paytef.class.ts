import axios from "axios";
import { SocketGateway } from "../sockets.gateway";
import { movimientosInstance } from "../movimientos/movimientos.clase";
import { parametrosInstance } from "src/parametros/parametros.clase";
import { trabajadoresInstance } from "src/trabajadores/trabajadores.clase";
import { ticketsInstance } from "src/tickets/tickets.clase";
import { cestas } from "src/cestas/cestas.clase";
import { TicketsInterface } from "src/tickets/tickets.interface";
import { CestasInterface } from "src/cestas/cestas.interface";
import { transaccionesInstance } from "src/transacciones/transacciones.class";
import { nuevoTicket } from "src/tickets/tickets.mongodb";
import { UtilesModule } from "src/utiles/utiles.module";
import { LogsClass } from "src/logs/logs.class";
import { TransaccionesInterface } from "src/transacciones/transacciones.interface";
import { Socket } from 'dgram';
import { Respuesta } from "./paytef.interface";

function limpiarNombreTienda(cadena: string) {
  const devolver = Number(cadena.replace(/\D/g, ''));
  if (isNaN(devolver) == false) {
    return devolver;
  } else {
    return 0;
  }
}

class PaytefClass {
  getTotal(cesta: CestasInterface): number {
    let total = 0;
    cesta.lista.forEach(itemLista => {
      total += itemLista.subtotal;
    });
    return total;
  }

  cancelarOperacion() {
    const params = parametrosInstance.getParametros();
    axios.post(`http://${params.ipTefpay}:8887/pinpad/cancel`, { "pinpad": "*" });
  }

  iniciarDatafono(idTicket: number, total: number, client: Socket) {
    const params = parametrosInstance.getParametros();
    if (UtilesModule.checkVariable(params.ipTefpay)) {
      axios.post(`http://${params.ipTefpay}:8887/transaction/start`, {
        pinpad: "*",
        opType: "sale",
        createReceipt: true,
        executeOptions: {
          method: "polling"
        },
        language: "es",
        requestedAmount: Math.round(total*100),
        requireConfirmation: false,
        transactionReference: idTicket,
        showResultSeconds: 5
      }).then((respuestaPaytef: any) => {
        if (respuestaPaytef.data.info.started) {
          // Arranca el ciclo de comprobaciones
          this.consultarEstadoOperacion(client, idTicket, total);
        } else {
          this.anularOperacion(idTicket, client, 'La operación no ha podido iniciar');
          // client.emit('consultaPaytef', { error: true, mensaje: 'La operación no ha podido iniciar' });
        }
      }).catch((err) => {
        this.anularOperacion(idTicket, client, 'Backend: ' + err.message);
      });
    } else {
      this.anularOperacion(idTicket, client, 'IP TefPay no definida, contacta con informática');
    }
  }

  /* Parámetros de entrada OK */
  async iniciarTransaccion(client: Socket, idCliente: string, idCesta:number): Promise<void> {

    try {
      /* Obtengo el trabajador actual */
      const idTrabajadorActivo = await trabajadoresInstance.getCurrentIdTrabajador();
      /* ¿Trabajador activo existe? */
      if (idTrabajadorActivo != null) {
        /* Obtengo la cesta del trabajador activo */
        const cesta = await cestas.getCestaByID(idCesta);
        /* ¿Existe la cesta del trabajador activo? */
        if (cesta != null) {
          /* Consigo el total de la cesta para enviarlo a PayTef */
          const total = this.getTotal(cesta); //cesta.tiposIva.importe1 + cesta.tiposIva.importe2 + cesta.tiposIva.importe3;
          // La lista no puede estar vacía ni el total puede ser cero.
          if (cesta.lista.length > 0 && total > 0) {
            const nuevoTicket = ticketsInstance.generarObjetoTicket((await ticketsInstance.getUltimoTicket())+1, total, cesta, "TARJETA", idTrabajadorActivo, idCliente);
            /* Cerrar ticket */
            const resCierreTicket = await paytefInstance.cerrarTicket(nuevoTicket); //resEstadoPaytef.data.result.receipts.clientReceipt);
            if (resCierreTicket.error === false) { /* Ticket creado */
              this.iniciarDatafono(resCierreTicket.info, total, client);
            } else {
              client.emit('consultaPaytef', { error: true, mensaje: resCierreTicket.mensaje });
            }
          } else {
            client.emit('consultaPaytef', { error: true, mensaje: 'Lista vacía o total a 0€' });
          }
        } else {
          client.emit('consultaPaytef', { error: true, mensaje: 'No existe la cesta del trabajador activo' });
        }
      } else {
        client.emit('consultaPaytef', { error: true, mensaje: 'No existe el trabajador activo' });
      }
    } catch(err) {
      this.cancelarOperacion();
      client.emit('consultaPaytef', { error: true, mensaje: err.message });
    }
  }

  anularOperacion(idTicket: number, client: Socket, msj = '') {
    ticketsInstance.anularTicket(idTicket).then((resAnulacion) => {
      if (resAnulacion) {
        client.emit('consultaPaytef', { error: true, mensaje: msj + ' Operación denegada. Ticket anulado' });
      } else {
        LogsClass.newLog('Error nuevo grave', `Ticket denegado por PayTef pero no anulado por el toc: idTicket: ${idTicket} tiemstamp: ${Date.now()}`);
        client.emit('consultaPaytef', { error: true, mensaje: 'CONTACTA A INFORMÁTICA. Ticket denegado por PayTef pero no anulado por el toc' });
      }
    });
  }

  async consultarEstadoOperacion(client: Socket, idTicket: number, total: number): Promise<void> {
    try {
      /* OBTENGO IP PAYTEF & ÚLTIMA TRANSACCIÓN DE MONGODB */
      const ipDatafono = parametrosInstance.getParametros().ipTefpay;

      /* Inicio consulta de estado de la operación */
      const resEstadoPaytef: any = await axios.post(`http://${ipDatafono}:8887/transaction/poll`, { pinpad: "*" });

      /* ¿Ya existe el resultado de PayTef? */
      if (UtilesModule.checkVariable(resEstadoPaytef.data.result)) {
          if (Number(resEstadoPaytef.data.result.transactionReference) === idTicket) {
            if (resEstadoPaytef.data.result.approved) {
              movimientosInstance.nuevaSalida(total, 'Targeta', 'TARJETA', false, idTicket);
              client.emit('consultaPaytef', { error: false, operacionCorrecta: true });
            } else {
              this.anularOperacion(idTicket, client);
            }
          } else if (resEstadoPaytef.data.result.approved) {
            LogsClass.newLog('Error nuevo (sin referencia)', `Ticket aprobado por PayTef y creado en el toc, pero sin referencia: ${idTicket} timestamp: ${Date.now()}`);
            client.emit('consultaPaytef', { error: false, operacionCorrecta: true });
          } else {
              this.anularOperacion(idTicket, client);
            }
      } else if (UtilesModule.checkVariable(resEstadoPaytef.data.info)) { /* ¿Existe info de PayTef? NO es igual a RESULT. Siempre debería existir, salvo que PayTef esté roto */
        if (resEstadoPaytef.data.info.transactionStatus === 'cancelling') {
          this.anularOperacion(idTicket, client, 'Operación cancelada');
        } else { // Vuelvo a empezar el ciclo
          await new Promise(r => setTimeout(r, 1000));
          this.consultarEstadoOperacion(client, idTicket, total);
        }
      } else {
        await new Promise(r => setTimeout(r, 1000));
        this.consultarEstadoOperacion(client, idTicket, total);
      }
    } catch(err) {
      const ipDatafono = parametrosInstance.getParametros().ipTefpay;
      axios.post(`http://${ipDatafono}:8887/pinpad/cancel`, { "pinpad": "*" });
      LogsClass.newLog('Error backend paytefClass consultarEstadoOperacion', err.message);
      this.anularOperacion(idTicket, client, 'Error ' + err.message);
    }
  }
  
  async cerrarTicket(nuevoTicket: TicketsInterface): Promise<Respuesta> {  
    if (await ticketsInstance.insertarTicket(nuevoTicket)) {
      if (await cestas.borrarCestaActiva()) { // Repasar esto porque no es la activa, sino una en concreto por id
        
        if (await parametrosInstance.setUltimoTicket(nuevoTicket._id)) {
          return { error: false, info: nuevoTicket._id };
        } else {
          return { error: true, mensaje: 'Error no se ha podido cambiar el último id ticket' };
        }
      } else {
        return { error: true, mensaje: 'Error, no se ha podido borrar la cesta' };
      }
    }
  }
}

const paytefInstance = new PaytefClass();
export { paytefInstance };
