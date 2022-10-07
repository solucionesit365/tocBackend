import { Controller, Get } from "@nestjs/common";
import axios from "axios";
import { parametrosInstance } from "src/parametros/parametros.clase";
import { paramsTicketInstance } from "./params-ticket.class";
import { logger } from "../logger";

@Controller("params-ticket")
export class ParamsTicketController {
  /* Eze 4.0 */
  @Get("descargarInfoTicket")
  async descargarInfoTicket() {
    try {
      const parametros = await parametrosInstance.getParametros();
      const res: any = await axios.post("info-ticket/getInfoTicket", {
        database: parametros.database,
        idCliente: parametros.codigoTienda,
      });
      return await paramsTicketInstance.insertarParametrosTicket(res.data.info);
    } catch (err) {
      logger.Error(err);
      return false;
    }
  }
}
