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

function limpiarNombreTienda(cadena: string) {
  const devolver = Number(cadena.replace(/\D/g, ''));
  if (isNaN(devolver) == false) {
    return devolver;
  } else {
    return 0;
  }
}

class PaytefClass {
  async iniciarTransaccion(client: Socket, idCliente: string): Promise<void> {
    try {
      /* Obtengo el trabajador actual */
      const idTrabajadorActivo = await trabajadoresInstance.getCurrentIdTrabajador();
      /* ¿Trabajador activo existe? */
      if (idTrabajadorActivo != null) {
        /* Obtengo la cesta del trabajador activo */
        const cesta = await cestas.getCestaByTrabajadorID(idTrabajadorActivo);
        /* ¿Existe la cesta del trabajador activo? */
        if (cesta != null) {
          /* Consigo el total de la cesta para enviarlo a PayTef */
          const total = cesta.tiposIva.importe1 + cesta.tiposIva.importe2 + cesta.tiposIva.importe3;
          // La lista no puede estar vacía ni el total puede ser cero.
          if (cesta.lista.length > 0 && total > 0) {
            /* Creo la transacción con los datos de la cesta, total e idCliente => MongoDB */
            const resTransaccion = await transaccionesInstance.crearTransaccion(cesta, total, idCliente);
            /* ¿La transacción se ha generado correctamente en MongoDB? */
            if (resTransaccion.error === false) {
              /* ¿insertedId es válido? */
              if (UtilesModule.checkVariable(resTransaccion.insertedId) && resTransaccion.insertedId !== '') {
                const params = parametrosInstance.getParametros();
                /* ¿La IP de PayTef está bien definida? */
                if (UtilesModule.checkVariable(params.ipTefpay)) {
                  /* COMIENZA LA TRANSACCIÓN */
                  const respuestaPaytef: any = await axios.post(`http://${params.ipTefpay}:8887/transaction/start`, {
                    pinpad: "*",
                    opType: "sale",
                    createReceipt: true,
                    executeOptions: {
                      method: "polling"
                    },
                    language: "es",
                    requestedAmount: Math.round(total*100),
                    requireConfirmation: false,
                    transactionReference: resTransaccion.insertedId,
                    showResultSeconds: 5
                  });
                  /* ¿Ha iniciado la operación en el datáfono? */
                  if (respuestaPaytef.data.info.started) {
                    this.consultarEstadoOperacion(client);
                  } else {
                    console.log(respuestaPaytef.data);
                    client.emit('consultaPaytef', { error: true, mensaje: 'La operación no ha podido iniciar' });
                  }
                } else {
                  client.emit('consultaPaytef', { error: true, mensaje: 'IP TefPay no definida, contacta con informática' });
                }
              }
            } else {
              console.log(resTransaccion.mensaje);
              client.emit('consultaPaytef', { error: true, mensaje: 'Error al crear la transacción' });
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
      console.log(err.message);
      client.emit('consultaPaytef', { error: true, mensaje: err.message });
      LogsClass.newLog('iniciarTransaccion PayTefClass', err.message)
    }
  }

  async consultarEstadoOperacion(client: Socket): Promise<void> {
    try {
      /* OBTENGO IP PAYTEF & ÚLTIMA TRANSACCIÓN DE MONGODB */
      const ipDatafono = parametrosInstance.getParametros().ipTefpay;
      const ultimaTransaccion: TransaccionesInterface = await transaccionesInstance.getUltimaTransaccion();

      /* Inicio consulta de estado de la operación */
      const resEstadoPaytef: any = await axios.post(`http://${ipDatafono}:8887/transaction/poll`, { pinpad: "*" });

      /* ¿Ya existe el resultado de PayTef? */
      if (UtilesModule.checkVariable(resEstadoPaytef.data.result)) {
        if (UtilesModule.checkVariable(resEstadoPaytef.data.result.transactionReference) && resEstadoPaytef.data.result.transactionReference != '') {
          /* ¿La transacción de PayTef es exactamente la misma que la última obtenida desde MongoDB? */
          if (resEstadoPaytef.data.result.transactionReference === ultimaTransaccion._id.toString()) {
            /* ¿Venta aprobada sin fallos? */
            if (resEstadoPaytef.data.result.approved && !resEstadoPaytef.data.result.failed) {
              // Añadir que la transacción ya ha sido cobrada => pagada: true (antes de que pueda fallar la inserción de ticket) !!!!!!
              /* Cierro ticket */
              const resCierreTicket = await paytefInstance.cerrarTicket(resEstadoPaytef.data.result.transactionReference);
              if (resCierreTicket.error === false) {
                /* Operación aprobada y finalizada */
                client.emit('consultaPaytef', { error: false, operacionCorrecta: true });
              } else {
                client.emit('consultaPaytef', { error: true, mensaje: resCierreTicket.mensaje });
              }
            } else {
              /* La operación ha sido denegada */
              client.emit('consultaPaytef', { error: true, mensaje: 'Operación denegada' });
            }
          } else {
            await axios.post(`http://${ipDatafono}:8887/pinpad/cancel`, { "pinpad": "*" });
            client.emit('consultaPaytef', { error: true, mensaje: 'La transacción no coincide con la actual de MongoDB' });
          }
        } else {
          /* ¿Cobrado pero sin referencia? */
          if (resEstadoPaytef.data.result.approved && !resEstadoPaytef.data.result.failed) {
            // Cobrado y sin transacción definida => PEOR ERROR POSIBLE
            LogsClass.newLog('PEOR ERROR POSIBLE', `no tengo referencia de la transacción: tiemstamp: ${Date.now()}`);
          }
          console.log(resEstadoPaytef.data);
          client.emit('consultaPaytef', { error: true, mensaje: 'Sin información de la última transacción => REINICIAR DATÁFONO' })
        }  
        /* ¿Existe info de PayTef? NO es igual a RESULT. Siempre debería existir, salvo que PayTef esté roto */
      } else if (UtilesModule.checkVariable(resEstadoPaytef.data.info)) {
        if (resEstadoPaytef.data.info.transactionStatus === 'cancelling') { // Tal vez se pueda borrar
          client.emit('consultaPaytef', { error: true, mensaje: 'Operación cancelada' });
        } else {
          /* Vuelvo a empezar el ciclo */
          await new Promise(r => setTimeout(r, 1000)); // Espera de un segundo para evitar bloquear el pinpad
          this.consultarEstadoOperacion(client);
        }
      } else {
        client.emit('consultaPaytef', { error: true, mensaje: 'Error, el datáfono no da respuesta' });
      }
    } catch(err) {
      console.log(err);
      LogsClass.newLog('Error backend paytefClass consultarEstadoOperacion', err.message);
      client.emit('consultaPaytef', { error: true, mensaje: 'Error ' + err.message });
    }
  }
  
  async cerrarTicket(idTransaccion: string) {
    return transaccionesInstance.getTransaccionById(idTransaccion).then(async (infoTransaccion) => {
      if (infoTransaccion != null) {
        try {
          await transaccionesInstance.setPagada(idTransaccion);
        } catch(err) {
          console.log(err);
          return { error: true, mensaje: 'Error, no se ha podido marcar como pagada la transacción ' + idTransaccion };
        }
        
        const parametros = parametrosInstance.getParametros();
        /* Creo datos del ticket */
        const nuevoTicket: TicketsInterface = {
          _id: (await ticketsInstance.getUltimoTicket())+1,
          timestamp: Date.now(),
          total: infoTransaccion.total,
          lista: infoTransaccion.cesta.lista,
          tipoPago: "TARJETA",
          idTrabajador: parametros.idCurrentTrabajador,
          tiposIva: infoTransaccion.cesta.tiposIva,
          cliente: infoTransaccion.idCliente,
          infoClienteVip: {
              esVip : false,
              nif: '',
              nombre: '',
              cp: '',
              direccion: '',
              ciudad: ''
          },
          enviado: false,
          enTransito: false,
          intentos: 0,
          comentario: '',
          regalo: (infoTransaccion.cesta.regalo == true && infoTransaccion.idCliente != '' && infoTransaccion.idCliente != null) ? (true): (false)
        }
        if (await ticketsInstance.insertarTicket(nuevoTicket)) {
          if (await cestas.borrarCestaActiva()) {
            movimientosInstance.nuevaSalida(infoTransaccion.total, 'Targeta', 'TARJETA', false, nuevoTicket._id);
            if (await parametrosInstance.setUltimoTicket(nuevoTicket._id)) {
              return { error: false };
            } else {
              return { error: true, mensaje: 'Error no se ha podido cambiar el último id ticket' };
            }
          } else {
            return { error: true, mensaje: 'Error, no se ha podido borrar la cesta' };
          }
        }
      } else {
        return { error: true, mensaje: 'Error,  no se ha podido recuperar la transacción' };
      }
    });      
  }
}

const paytefInstance = new PaytefClass();
export { paytefInstance };
