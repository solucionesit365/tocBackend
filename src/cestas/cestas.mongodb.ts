import { conexion } from "../conexion/mongodb";
import { CestasInterface } from "./cestas.interface";

/* Eze 4.0 */
export async function getCestaById(
  idCesta: CestasInterface["_id"]
): Promise<CestasInterface> {
  const database = (await conexion).db("tocgame");
  const cesta = database.collection<CestasInterface>("cestas");
  return await cesta.findOne({ _id: idCesta });
}

/* Eze 4.0 */
export async function deleteCesta(
  idCesta: CestasInterface["_id"]
): Promise<boolean> {
  const database = (await conexion).db("tocgame");
  const cesta = database.collection<CestasInterface>("cestas");
  const resultado = await cesta.deleteOne({ _id: idCesta });
  return resultado.acknowledged && resultado.deletedCount === 1;
}

/* Eze 4.0 */
export async function getAllCestas(): Promise<CestasInterface[]> {
  const database = (await conexion).db("tocgame");
  const cesta = database.collection<CestasInterface>("cestas");
  return await cesta.find().toArray();
}

/* Eze 4.0 */
export async function updateCesta(cesta: CestasInterface): Promise<boolean> {
  const database = (await conexion).db("tocgame");
  const unaCesta = database.collection<CestasInterface>("cestas");
  const resultado = await unaCesta.updateOne(
    { _id: cesta._id },
    { $set: cesta }
  );
  return resultado.acknowledged && resultado.matchedCount === 1;
}

/* Eze 4.0 */
export async function createCesta(cesta: CestasInterface): Promise<boolean> {
  const database = (await conexion).db("tocgame");
  const cestasColeccion = database.collection<CestasInterface>("cestas");
  return (await cestasColeccion.insertOne(cesta)).acknowledged;
}
