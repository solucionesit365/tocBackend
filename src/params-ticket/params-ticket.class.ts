import * as schParamsTicket from "./params-ticket.mongo";
import { ParamsTicketInterface } from "./params-ticket.interface";

export class ParamsTicketClass {
  /* Eze 4.0 */
  insertarParametrosTicket = async (data: ParamsTicketInterface[]) =>
    await schParamsTicket.insertarParametrosTicket(data);

  /* Eze 4.0 */
  getParamsTicket = async () => await schParamsTicket.getParamsTicket();
}

export const paramsTicketInstance = new ParamsTicketClass();
