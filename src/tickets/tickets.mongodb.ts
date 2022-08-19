import {conexion} from '../conexion/mongodb';
import {TicketsInterface} from './tickets.interface';
import {UtilesModule} from '../utiles/utiles.module';
import { ticketsInstance } from './tickets.clase';
import { parametrosInstance } from '../parametros/parametros.clase';

/* Eze v23 */
export async function limpiezaTickets(): Promise<boolean> {
  try {
    const database = (await conexion).db("tocgame");
    const tickets = database.collection("tickets");
    return (await tickets.deleteMany({enviado: true, timestamp: {$lte: UtilesModule.restarDiasTimestamp(Date.now())}})).acknowledged;
  } catch (err) {
    console.log(err);
    return false;
  }
}

/* Eze v23 */
export async function getTicketByID(idTicket: number): Promise<TicketsInterface> {
  try {
    const database = (await conexion).db("tocgame");
    const tickets = database.collection("tickets");
    return await tickets.findOne({_id: idTicket}) as TicketsInterface;
  } catch (err) {
    console.log(err);
    return null;
  }
}

/* Eze v23 */
export async function getTicketsIntervalo(inicioTime: number, finalTime: number): Promise<TicketsInterface[]> {
  try {
    const database = (await conexion).db("tocgame");
    const tickets = database.collection("tickets");
    return await tickets.find({timestamp: {$lte: finalTime, $gte: inicioTime}}).toArray() as TicketsInterface[];
  } catch (err) {
    console.log(err);
    return [];
  }
}

/* Eze v23 */
export async function getDedudaGlovo(inicioTime: number, finalTime: number): Promise<number> {
  try {
    const database = (await conexion).db("tocgame");
    const tickets = database.collection("tickets");
    const resultado = await tickets.find({
      $and: [
        {cliente: "CliBoti_000_{A83B364B-252F-464B-B0C3-AA89DA258F64}"},
        {timestamp: {$gte: inicioTime}},
        {timestamp: {$lte: finalTime}},
      ],
    });
    const arrayResult = await resultado.toArray();
  
    let suma = 0;
    for (let i = 0; i < arrayResult.length; i++) {
      suma += arrayResult[i].total;
    }
    return suma;
  } catch (err) {
    console.log(err);
    return 0;
  }
}

/* Eze v23 */
export async function getTotalTkrs(inicioTime: number, finalTime: number): Promise<number> {
  try {
    const database = (await conexion).db("tocgame");
    const tickets = database.collection("tickets");
    const resultado = await tickets.find({
      $and: [
        {tipoPago: "TICKET_RESTAURANT"},
        {timestamp: {$gte: inicioTime}},
        {timestamp: {$lte: finalTime}},
      ],
    });
    const arrayResult = await resultado.toArray();
  
    let suma = 0;
    for (let i = 0; i < arrayResult.length; i++) {
      suma += arrayResult[i].total;
    }
    return suma;
  } catch (err) {
    console.log(err);
    return 0;
  }
}

/*  Devuelve el ticket más antiguo con estado enviado = false
    para enviarlo al servidor
    Eze v23
*/
export async function getTicketMasAntiguo(): Promise<TicketsInterface> {
  try {
    const database = (await conexion).db("tocgame");
    const tickets = database.collection("tickets");
    return await tickets.findOne({enviado: false}, {sort: {_id: 1}}) as TicketsInterface;
  } catch (err) {
    console.log(err);
    return null;
  }
}

/* Eze v23 */
export async function getUltimoTicket(): Promise<TicketsInterface> {
  try {
    const database = (await conexion).db("tocgame");
    const tickets = database.collection("tickets");
    return await tickets.findOne({}, {sort: {_id: -1}}) as TicketsInterface;
  } catch (err) {
    console.log(err);
    return null;
  }
}

/* Eze v23 */
export async function nuevoTicket(ticket: any): Promise<boolean> {
  try {
    const database = (await conexion).db("tocgame");
    const tickets = database.collection("tickets");
    return (await tickets.insertOne(ticket)).acknowledged;
  } catch (err) {
    console.log(err);
    return false;
  }
}

/* Eze v23 */
export async function desbloquearTicket(idTicket: number) {
  try {
    const database = (await conexion).db("tocgame");
    const tickets = database.collection("tickets");
    return (await tickets.updateOne({ _id: idTicket }, {$set: { "bloqueado": false }}, { upsert: true })).acknowledged;
  } catch (err) {
    console.log(err);
    return false;
  }
}

/* Eze v23 */
export async function actualizarEstadoTicket(ticket: TicketsInterface): Promise<boolean> {
  try {
    const database = (await conexion).db("tocgame");
    const tickets = database.collection("tickets");
    return (await tickets.updateOne({_id: ticket._id}, {$set: {
      "enviado": ticket.enviado,
    }})).acknowledged;
  } catch (err) {
    console.log(err);
    return false;
  }
}

/* Eze v23 */
export async function borrarTicket(idTicket: number): Promise<boolean> {
  try {
    const database = (await conexion).db("tocgame");
    const tickets = database.collection("tickets");
    const resultado = await tickets.deleteOne({ _id: idTicket });
    const resSetUltimoTicket = await parametrosInstance.setUltimoTicket((idTicket-1 < 0) ? (0) : (idTicket-1));
    return (resultado.acknowledged && resSetUltimoTicket);
  } catch (err) {
    console.log(err);
    return false;
  }
}

/* Eze v23 - Solo se invoca manualmente desde la lista de tickets (frontend dependienta) */
export async function anularTicket(idTicket: number): Promise<boolean> {
  try {
      const database = (await conexion).db("tocgame");
      const ticketsAnulados = database.collection("ticketsAnulados");
      const resultado = await ticketsAnulados.findOne({ idTicketAnulado: idTicket });
      if (resultado === null) {
        let ticket = await getTicketByID(idTicket);
        if (ticket.tipoPago == "TARJETA")
          throw Error("Por el momento no es posible anular un ticket pagado con tarjeta");
        
        if (ticket.total > 0) {
          const id = await ticketsInstance.getUltimoTicket() + 1;
          ticket.enviado = false;
          ticket._id = id;
          ticket.timestamp = Date.now();
          ticket.total = ( ticket.total *-1);
          ticket.lista.forEach((element) => {
            element.subtotal = (element.subtotal * -1);
          });
          const tickets = database.collection<TicketsInterface>("tickets");
          const resultado = (await tickets.insertOne(ticket)).acknowledged;
          await ticketsAnulados.insertOne({ idTicketAnulado: idTicket });
          const resSetUltimoTicket = await parametrosInstance.setUltimoTicket(ticket._id);
          return (resultado && resSetUltimoTicket);
        }
      }
      return false;
    } catch (err) {
    console.log(err);
    return false;
  }
}
