import { TicketsInterface } from "./tickets.interface";
import * as schTickets from "./tickets.mongodb";
import { cestasInstance } from "../cestas/cestas.clase";
import { parametrosInstance } from "../parametros/parametros.clase";
import { CestasInterface } from "../cestas/cestas.interface";
import { logger } from "../logger";
import { cajaInstance } from "../caja/caja.clase";
import { io } from "../sockets.gateway";

export class TicketsClase {
  /* Eze 4.0 */
  getTicketById = (idTicket: number) => schTickets.getTicketByID(idTicket);

  /* Eze 4.0 */
  anularTicket = (idTicket: number) => schTickets.anularTicket(idTicket);

  /* Eze 4.0 */
  getTicketsIntervalo = (fechaInicio: number, fechaFinal: number) =>
    schTickets.getTicketsIntervalo(fechaInicio, fechaFinal);

  /* Eze 4.0 */
  async getUltimoIdTicket() {
    const ultimoIdMongo = (await schTickets.getUltimoTicket())._id;
    const ultimoIdParametros = (await parametrosInstance.getParametros())
      .ultimoTicket;
    return ultimoIdParametros > ultimoIdMongo
      ? ultimoIdParametros
      : ultimoIdMongo;
  }

  getUltimoTicket = async (): Promise<TicketsInterface> => await schTickets.getUltimoTicket();

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
    idTrabajador: TicketsInterface["idTrabajador"],
    cesta: CestasInterface
  ): Promise<TicketsInterface> {
    try {
      const nuevoTicket: TicketsInterface = {
        _id: await this.getProximoId(),
        timestamp: Date.now(),
        total,
        idCliente: cesta.idCliente,
        idTrabajador,
        cesta,
        enviado: false,
      };
      return nuevoTicket;
    } catch (err) {
      logger.Error(104, err);
      return null;
    }
  }

  /* Eze 4.0 */
  getTicketMasAntiguo = () => schTickets.getTicketMasAntiguo();

  /* Eze 4.0 */
  actualizarEstadoTicket = (ticket: TicketsInterface) =>
    schTickets.actualizarEstadoTicket(ticket);

  actualizarTickets = async () => {
    const infoCaja = await cajaInstance.getInfoCajaAbierta();
    if (infoCaja?.inicioTime) {
      const arrayTickets = await this.getTicketsIntervalo(
        infoCaja.inicioTime,
        Date.now()
      );
      if (arrayTickets) io.emit("cargarVentas", arrayTickets);
    } else {
      logger.Error(
        130,
        "No se ha podido enviar los tickets actualizados por socket debido a problemas con la caja"
      );
    }
  };
}

export const ticketsInstance = new TicketsClase();
