import { InsertManyResult } from "mongodb";
import { conexion } from "../conexion/mongodb";
import { PromocionesInterface } from "./promociones.interface";

/* Eze 4.0 */
export async function getPromociones(): Promise<PromocionesInterface[]> {
  const database = (await conexion).db("tocgame");
  const promociones = database.collection<PromocionesInterface>("promociones");
  return await promociones.find().toArray();
}

/* Eze 4.0 */
export async function borrarPromociones(): Promise<void> {
  const database = (await conexion).db("tocgame");
  const collectionList = await database.listCollections().toArray();
  for (let i = 0; i < collectionList.length; i++) {
    if (collectionList[i].name === "promociones")  {
      const promociones = database.collection("promociones");
      await promociones.drop();
      break;
    }
  }
}

/* Eze 4.0 */
export async function insertarPromociones(arrayPromociones): Promise<boolean> {
  await borrarPromociones()
  const database = (await conexion).db("tocgame");
  const promociones = database.collection("promociones");
  return (await promociones.insertMany(arrayPromociones)).acknowledged;
}
