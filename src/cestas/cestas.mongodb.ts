import { conexion } from "../conexion/mongodb";
import { CestasInterface } from "./cestas.interface";
import { logger } from "../logger";

/* Eze 4.0 */
export async function getCestaById(idCesta: CestasInterface["_id"]): Promise<CestasInterface> {
  try {
    const database = (await conexion).db("tocgame");
    const cesta = database.collection<CestasInterface>("cestas");
    return await cesta.findOne({ _id: idCesta });
  } catch (err) {
    logger.Error(err);
    return null;
  }
}


/* Eze 4.0 */
export async function deleteCesta(idCesta: CestasInterface["_id"]): Promise<boolean> {
  try {
    const database = (await conexion).db("tocgame");
    const cesta = database.collection<CestasInterface>("cestas");
    const resultado = await cesta.deleteOne({ _id: idCesta });
    return (resultado.acknowledged && resultado.deletedCount === 1);
  } catch (err) {
    logger.Error(err);
  }
}

/* Eze 4.0 */
export async function getAllCestas(): Promise<CestasInterface[]> {
  try {
    const database = (await conexion).db("tocgame");
    const cesta = database.collection<CestasInterface>("cestas");
    return await cesta.find().toArray();
  } catch (err) {
    logger.Error(err);
    return [];
  }
}

/* Eze 4.0 */
export async function updateCesta(cesta: CestasInterface): Promise<boolean> {
  const database = (await conexion).db("tocgame");
  const unaCesta = database.collection<CestasInterface>("cestas");
  const resultado = await unaCesta.updateOne(
    { _id: cesta._id },
    { $set: cesta }
  );
  return (resultado.acknowledged && resultado.matchedCount === 1);
}

/* Eze 4.0 */
export async function createCesta(cesta: CestasInterface): Promise<boolean> {
  try {
    const database = (await conexion).db("tocgame");
    const cestasColeccion = database.collection<CestasInterface>("cestas");
    return (await cestasColeccion.insertOne(cesta)).acknowledged;
  } catch (err) {
    logger.Error(err);
    return false;
  }
}
