import { Controller, Post, Get, Body, Query } from "@nestjs/common";
import { ticketsInstance } from "./tickets.clase";
import { cajaInstance } from "../caja/caja.clase";

@Controller("tickets")
export class TicketsController {
  /* NO */
  @Post("getTicketsIntervalo")
  getTicketsIntervalo(@Query() params) {
    return cajaInstance
      .getInfoCaja()
      .then((infoCaja) => {
        if (infoCaja != null) {
          return ticketsInstance.getTicketsIntervalo(
            infoCaja.inicioTime,
            Date.now()
          );
        } else {
          return [];
        }
      })
      .catch((err) => {
        console.log(err);
        return [];
      });
  }

  /* Eze v23 */
  @Post("getTickets")
  getTickets(@Body() params) {
    if (params.ticketID != undefined)
      return ticketsInstance.getTicketByID(params.ticketID);

    return false;
  }

  /* Eze v23 */
  @Post("crearTicketEfectivo")
  crearTicketEfectivo(@Body() params) {
    if (
      params.total != undefined &&
      params.idCesta != undefined &&
      params.idCliente != undefined &&
      params.idTrabajador
    )
      return ticketsInstance.crearTicketEfectivo(
        params.total,
        params.idCesta,
        params.idCliente,
        params.idTrabajador
      );

    return false;
  }

  /* Eze v23 */
  @Post("crearTicketDatafono3G")
  crearTicketDatafono3G(@Body() params) {
    if (
      params.total != undefined &&
      params.idCesta != undefined &&
      params.idCliente != undefined &&
      params.idTrabajador
    )
      return ticketsInstance.crearTicketDatafono3G(
        params.total,
        params.idCesta,
        params.idCliente,
        params.idTrabajador
      );

    return false;
  }

  /* Eze v23 */
  @Post("crearTicketDeuda")
  crearTicketDeuda(@Body() params) {
    if (
      params.total != undefined &&
      params.idCesta != undefined &&
      params.idCliente != undefined &&
      params.infoClienteVip != undefined &&
      params.idTrabajador
    )
      return ticketsInstance.crearTicketDeuda(
        params.total,
        params.idCesta,
        params.idCliente,
        params.infoClienteVip,
        params.idTrabajador
      );

    return false;
  }

  /* Eze v23 */
  @Post("crearTicketConsumoPersonal")
  crearTicketConsumoPersonal(@Body() params) {
    if (params.idCesta != undefined && params.idTrabajador)
      return ticketsInstance.crearTicketConsumoPersonal(
        params.idCesta,
        params.idTrabajador
      );

    return false;
  }

  /* Eze v23 */
  @Post("crearTicketTKRS")
  crearTicketTKRS(@Body() params) {
    if (
      params.total != undefined &&
      params.idCesta != undefined &&
      params.idCliente != undefined &&
      params.idTrabajador
    )
      return ticketsInstance.crearTicketTKRS(
        params.total,
        params.totalTkrs,
        params.idCesta,
        params.idCliente,
        params.idTrabajador
      );

    return false;
  }

  /* Eze v23 */
  @Post("rectificativa")
  rectificativa(@Body() params) {
    return ticketsInstance.anularTicket(params.ticketID);
  }
}
