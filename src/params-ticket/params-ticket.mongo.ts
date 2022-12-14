import { conexion } from "../conexion/mongodb";
import { ParamsTicketInterface } from "./params-ticket.interface";

/* Eze 4.0 */
export async function insertarParametrosTicket(data: ParamsTicketInterface[]) {
  await borrarInfoTicket();
  const database = (await conexion).db("tocgame");
  const paramTickets =
    database.collection<ParamsTicketInterface>("parametros-tickets");
  return (await paramTickets.insertMany(data)).acknowledged;
}

/* Eze 4.0 */
export async function getParamsTicket(): Promise<ParamsTicketInterface[]> {
  const database = (await conexion).db("tocgame");
  const paramTickets =
    database.collection<ParamsTicketInterface>("parametros-tickets");
  return await paramTickets.find({}).toArray();
}

/* Eze 4.0 */
export async function borrarInfoTicket(): Promise<void> {
  const database = (await conexion).db("tocgame");
  const collectionList = await database.listCollections().toArray();

  for (let i = 0; i < collectionList.length; i++) {
    if (collectionList[i].name === "parametros-tickets") {
      await database.collection("parametros-tickets").drop();
      break;
    }
  }
}
