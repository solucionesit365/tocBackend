import { conexion } from "../conexion/mongodb";
import { ParametrosInterface } from "./parametros.interface";

/* Eze 4.0 */
export async function getParametros(): Promise<ParametrosInterface> {
  const database = (await conexion).db("tocgame");
  const parametros = database.collection<ParametrosInterface>("parametros");
  return await parametros.findOne({ _id: "PARAMETROS" });
}

/* Eze 4.0 */
export async function setParametros(
  params: ParametrosInterface
): Promise<boolean> {
  const database = (await conexion).db("tocgame");
  const parametros = database.collection("parametros");
  return (
    await parametros.updateOne(
      { _id: "PARAMETROS" },
      { $set: params },
      { upsert: true }
    )
  ).acknowledged;
}

/* Eze 4.0 */
export async function setUltimoTicket(idTicket: number): Promise<boolean> {
  const database = (await conexion).db("tocgame");
  const parametros = database.collection("parametros");
  return (
    await parametros.updateOne(
      { _id: "PARAMETROS" },
      { $set: { ultimoTicket: idTicket } },
      { upsert: true }
    )
  ).acknowledged;
}

/* Eze 4.0 */
export async function setVidAndPid(
  vid: string,
  pid: string,
  com: string
): Promise<boolean> {
  const database = (await conexion).db("tocgame");
  const parametros = database.collection("parametros");
  return (
    await parametros.updateOne(
      { _id: "PARAMETROS" },
      { $set: { impresoraUsbInfo: { vid: vid, pid: pid }, visor: com } },
      { upsert: true }
    )
  ).acknowledged;
}

/* Eze 4.0 */
export async function setIpPaytef(ip: string): Promise<boolean> {
  const database = (await conexion).db("tocgame");
  const parametros = database.collection("parametros");
  return (
    await parametros.updateOne(
      { _id: "PARAMETROS" },
      { $set: { ipTefpay: ip } },
      { upsert: true }
    )
  ).acknowledged;
}
