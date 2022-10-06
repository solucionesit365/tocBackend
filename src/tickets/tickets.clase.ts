import { TicketsInterface } from "./tickets.interface";
import * as schTickets from "./tickets.mongodb";
import { cestasInstance } from "../cestas/cestas.clase";
import { parametrosInstance } from "../parametros/parametros.clase";
import { CestasInterface } from "../cestas/cestas.interface";


export class TicketsClase {
  /* Eze 4.0 */
  getTicketById = (idTicket: number) => schTickets.getTicketByID(idTicket);

  /* Eze 4.0 */
  anularTicket = (idTicket: number) => schTickets.anularTicket(idTicket);

  /* Eze 4.0 */
  getTicketsIntervalo = (fechaInicio: number, fechaFinal: number) => schTickets.getTicketsIntervalo(fechaInicio, fechaFinal);

  /* Eze 4.0 */
  async getUltimoIdTicket() {
    const ultimoIdMongo = (await schTickets.getUltimoTicket())._id;
    const ultimoIdParametros = (await parametrosInstance.getParametros()).ultimoTicket;
    return (ultimoIdParametros > ultimoIdMongo) ? (ultimoIdParametros) : (ultimoIdMongo);
  }

  /* Eze 4.0 */
  async getProximoId(): Promise<number> {
    const ultimoIdTicket = await this.getUltimoIdTicket();
    if (typeof ultimoIdTicket === "number") return ultimoIdTicket + 1;

    throw Error("El ultimoIdTicket no es correcto");
  }

  /* Eze 4.0 */
  async insertarTicket(ticket: TicketsInterface): Promise<boolean> {
    if (ticket.cesta.lista.length == 0)
      throw Error("Error al insertar ticket: la lista está vacía");

    return await schTickets.nuevoTicket(ticket);
  }

  /* Eze 4.0 */
  async generarNuevoTicket(
    total: TicketsInterface["total"],
    idCesta: CestasInterface["_id"],
    idCliente: TicketsInterface["idCliente"],
    idTrabajador: TicketsInterface["idTrabajador"]
  ): Promise<TicketsInterface> {
    try {
      const cesta = await cestasInstance.getCestaById(idCesta);
      const nuevoTicket: TicketsInterface = {
        _id: await this.getProximoId(),
        timestamp: Date.now(),
        total,
        idCliente,
        idTrabajador,
        cesta,
        enviado: false
      };
      return nuevoTicket;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  /* Eze 4.0 */
  getTicketMasAntiguo = () => schTickets.getTicketMasAntiguo();

  /* Eze 4.0 */
  actualizarEstadoTicket = (ticket: TicketsInterface) => schTickets.actualizarEstadoTicket(ticket);
}

export const ticketsInstance = new TicketsClase();
