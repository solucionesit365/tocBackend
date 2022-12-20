import { Controller, Get } from "@nestjs/common";
import { logger } from "src/logger";
import { ticketsInstance } from "src/tickets/tickets.clase";
import { TicketsInterface } from "src/tickets/tickets.interface";
import { nuevaInstancePromociones } from "./promociones.clase";

@Controller("promociones")
export class PromocionesController {
  @Get("descargarPromociones")
  async descargarPromociones() {
    try {
      return await nuevaInstancePromociones.descargarPromociones();
    } catch (err) {
      logger.Error(127, err);
      return false;
    }
  }

  @Get("test")
  async test() {
    try {
      const ticket = await ticketsInstance.getTicketById(439650);
      nuevaInstancePromociones.deshacerPromociones(ticket);
      return ticket;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
