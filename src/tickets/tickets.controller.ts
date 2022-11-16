import { Controller, Post, Body } from "@nestjs/common";
import { ticketsInstance } from "./tickets.clase";
import { movimientosInstance } from "../movimientos/movimientos.clase";
import { logger } from "../logger";
import { cestasInstance } from "../cestas/cestas.clase";
import { paytefInstance } from "src/paytef/paytef.class";

@Controller("tickets")
export class TicketsController {
  /* Eze 4.0 */
  @Post("getTicketsIntervalo")
  async getTicketsIntervalo(@Body() { inicioTime, finalTime }) {
    try {
      if (inicioTime && finalTime)
        return await ticketsInstance.getTicketsIntervalo(inicioTime, finalTime);
      throw Error("Error, faltan datos en getTiketsIntervalo() controller");
    } catch (err) {
      logger.Error(105, err);
      return null;
    }
  }

  /* Eze 4.0 */
  @Post("getTicket")
  async getTickets(@Body() { ticketId }) {
    try {
      if (ticketId) await ticketsInstance.getTicketById(ticketId);
      throw Error("Error, faltan datos en getTicket() controller");
    } catch (err) {
      logger.Error(106, err);
      return null;
    }
  }

  /* Eze 4.0 */
  @Post("crearTicket")
  async crearTicket(@Body() { total, idCesta, idTrabajador, tipo }) {
    try {
      if (typeof total == "number" && idCesta && idTrabajador && tipo) {
        const cesta = await cestasInstance.getCestaById(idCesta);
        const ticket = await ticketsInstance.generarNuevoTicket(
          total,
          idTrabajador,
          cesta
        );
        if (!ticket)
          throw Error(
            "Error, no se ha podido generar el objecto del ticket en crearTicket controller 3"
          );
        if (await ticketsInstance.insertarTicket(ticket)) {
          await cestasInstance.borrarArticulosCesta(idCesta);
          if (tipo === "TARJETA") paytefInstance.iniciarTransaccion(idTrabajador, ticket._id, total);
          ticketsInstance.actualizarTickets();
          return await movimientosInstance.nuevoMovimiento(
            total,
            "",
            tipo,
            ticket._id,
            idTrabajador
          );
        }

        throw Error(
          "Error, no se ha podido crear el ticket en crearTicket() controller 2"
        );
      }
      throw Error("Error, faltan datos en crearTicket() controller 1");
    } catch (err) {
      logger.Error(107, err);
      return false;
    }
  }

  /* Eze 4.0 */
  @Post("rectificativa")
  async rectificativa(@Body() { ticketId }) {
    try {
      if (ticketId) return await ticketsInstance.anularTicket(ticketId);
      throw Error("Error, faltan datos en rectificativa() controller");
    } catch (err) {
      logger.Error(108, err);
      return false;
    }
  }
}
