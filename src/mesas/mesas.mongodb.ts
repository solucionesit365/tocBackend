import { conexion } from "../conexion/mongodb";
import { MesaInterface } from "./mesas.interface";

export async function getMesas() {
  const db = (await conexion).db("tocgame");
  const mesasCollection = db.collection<MesaInterface>("mesas");
  return await mesasCollection.find({}).toArray();
}

export async function deleteMesas() {
  const db = (await conexion).db("tocgame");
  const collectionList = await db.listCollections().toArray();
  for (let i = 0; i < collectionList.length; i++) {
    if (collectionList[i].name === "mesas") {
      await db.collection("mesas").drop();
      break;
    }
  }
}

export async function insertMesas(arrayMesas: MesaInterface[]) {
  await deleteMesas();
  const db = (await conexion).db("tocgame");
  const mesasCollection = db.collection<MesaInterface>("mesas");
  const resultado = await mesasCollection.insertMany(arrayMesas);
  return resultado.acknowledged && resultado.insertedCount > 0;
}
