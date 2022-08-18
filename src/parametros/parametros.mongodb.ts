import { conexion } from "../conexion/mongodb";
import { ParametrosInterface } from "./parametros.interface";

/* Eze v23 */
export async function getParametros(): Promise<ParametrosInterface> {
  try {
    const database = (await conexion).db("tocgame");
    const parametros = database.collection<ParametrosInterface>("parametros");
    return await parametros.findOne({ _id: "PARAMETROS" });
  } catch (err) {
    console.log(err);
    return null;
  }
}

/* Eze v23 */
export async function setParametros(
  params: ParametrosInterface
): Promise<boolean> {
  try {
    const database = (await conexion).db("tocgame");
    const parametros = database.collection("parametros");
    return (
      await parametros.updateOne(
        { _id: "PARAMETROS" },
        { $set: params },
        { upsert: true }
      )
    ).acknowledged;
  } catch (err) {
    console.log(err);
    return false;
  }
}

/* Eze v23 */
export async function setUltimoTicket(idTicket: number): Promise<boolean> {
  try {
    const database = (await conexion).db("tocgame");
    const parametros = database.collection("parametros");
    return (
      await parametros.updateOne(
        { _id: "PARAMETROS" },
        { $set: { ultimoTicket: idTicket } },
        { upsert: true }
      )
    ).acknowledged;
  } catch (err) {
    console.log(err);
    return false;
  }
}

/* Eze v23 */
export async function setVidAndPid(
  vid: string,
  pid: string,
  com: string
): Promise<boolean> {
  try {
    const database = (await conexion).db("tocgame");
    const parametros = database.collection("parametros");
    return (
      await parametros.updateOne(
        { _id: "PARAMETROS" },
        { $set: { impresoraUsbInfo: { vid: vid, pid: pid }, visor: com } },
        { upsert: true }
      )
    ).acknowledged;
  } catch (err) {
    console.log(err);
    return false;
  }
}

/* Eze v23 */
export async function setIpPaytef(ip: string): Promise<boolean> {
  try {
    const database = (await conexion).db("tocgame");
    const parametros = database.collection("parametros");
    return (
      await parametros.updateOne(
        { _id: "PARAMETROS" },
        { $set: { ipTefpay: ip } },
        { upsert: true }
      )
    ).acknowledged;
  } catch (err) {
    console.log(err);
    return false;
  }
}
