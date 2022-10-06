import axios from 'axios';
import {movimientosInstance} from '../movimientos/movimientos.clase';
import {parametrosInstance} from 'src/parametros/parametros.clase';
import {ticketsInstance} from 'src/tickets/tickets.clase';
import {TicketsInterface} from 'src/tickets/tickets.interface';
import {Socket} from 'dgram';
import { CancelInterface } from './paytef.interface';

class PaytefClass {
  /* Eze 4.0 */
  async iniciarTransaccion(client: Socket, idTrabajador: number, idTicket: TicketsInterface["_id"]): Promise<void> {
    const ticket = await ticketsInstance.getTicketById(idTicket);
    const parametros = await parametrosInstance.getParametros();
    const opciones = {
      pinpad: '*',
      opType: 'sale',
      createReceipt: true,
      executeOptions: {
        method: 'polling',
      },
      language: 'es',
      requestedAmount: Math.round(ticket.total*100),
      requireConfirmation: false,
      transactionReference: idTicket,
      showResultSeconds: 5,
    };

    if (ticket && parametros.ipTefpay) {
      const respuestaPayef: any = (await axios.post(`http://${parametros.ipTefpay}:8887/transaction/start`, opciones)).data;
      if (respuestaPayef.info.started) await this.bucleComprobacion(idTicket, ticket.total, idTrabajador, client);
      throw Error("Error, la transacción no ha podido empezar paytef.class");
    } else {
      throw Error("Error, ticket o ipTefpay incorrectos en iniciarTransaccion() paytef.class");
    }
  }

  /* Eze 4.0 */
  async bucleComprobacion(idTicket: TicketsInterface["_id"], total: TicketsInterface["total"], idTrabajador: TicketsInterface["idTrabajador"], client: Socket): Promise<void> {
    const ipDatafono = (await parametrosInstance.getParametros()).ipTefpay;
    const resEstadoPaytef: any = (await axios.post(`http://${ipDatafono}:8887/transaction/poll`, { pinpad: "*" })).data;

    if (resEstadoPaytef.result) {
      if (resEstadoPaytef.data.result.approved) {
        movimientosInstance.nuevoMovimiento(total, "Targeta", "TARJETA", idTicket, idTrabajador);
        client.emit('consultaPaytef', true);
      } else {
        client.emit("consultaPaytef", false);
      }      
    } else {
      await new Promise((r) => setTimeout(r, 1000));
      await this.bucleComprobacion(idTicket, total, idTrabajador, client);
    }
  }

  /* Eze 4.0 */
  async cancelarOperacionActual() {
    const ipDatafono = (await parametrosInstance.getParametros()).ipTefpay;
    const resultado: CancelInterface = (await axios.post(`http://${ipDatafono}:8887/pinpad/cancel`, {'pinpad': '*'})).data as CancelInterface;
    return resultado.info.success;
  }
}

const paytefInstance = new PaytefClass();
export {paytefInstance};
