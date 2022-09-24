import { TrabajadoresInterface } from "src/trabajadores/trabajadores.interface";
import { conexion } from "../conexion/mongodb";
import { cestas } from "./cestas.clase";
import { CestasInterface } from "./cestas.interface";

/* Eze v23 */
export async function getCestaByID(idCesta: number): Promise<CestasInterface> {
  try {
    const database = (await conexion).db("tocgame");
    const cesta = database.collection<CestasInterface>("cestas");
    return await cesta.findOne({ _id: idCesta });
  } catch (err) {
    console.log(err);
    return null;
  }
}

/* Eze v23 */
export async function borrarCestaDelTrabajador(
  idTrabajador: number
): Promise<boolean> {
  try {
    const database = (await conexion).db("tocgame");
    const trabajadores =
      database.collection<TrabajadoresInterface>("trabajadores");
    const trabajador = await trabajadores.findOne({ _id: idTrabajador });
    if (trabajador) {
      const cesta = database.collection<CestasInterface>("cestas");
      const resultado = await cesta.deleteOne({ _id: trabajador.idCesta });
      return resultado.acknowledged;
    } else {
      throw Error("No existe el trabajador");
    }
  } catch (err) {
    console.log(err);
    return false;
  }
}

/* Eze v23 */
export async function deleteCesta(idCesta: number): Promise<boolean> {
  try {
    const database = (await conexion).db("tocgame");
    const cesta = database.collection<CestasInterface>("cestas");
    const resultado = await cesta.deleteOne({ _id: idCesta });
    return resultado.acknowledged && resultado.deletedCount === 1;
  } catch (err) {
    console.log(err);
  }
}

/* Eze v23 */
export async function getAllCestas(): Promise<CestasInterface[]> {
  try {
    const database = (await conexion).db("tocgame");
    const cesta = database.collection<CestasInterface>("cestas");
    return await cesta.find().toArray();
  } catch (err) {
    console.log(err);
    return [];
  }
}

/* Eze v23 */
export async function updateCesta(cesta: CestasInterface): Promise<boolean> {
  try {
    const database = (await conexion).db("tocgame");
    const unaCesta = database.collection<CestasInterface>("cestas");
    const resultado = await unaCesta.updateOne(
      { _id: cesta._id },
      { $set: cesta }
    );
    return resultado.acknowledged && resultado.matchedCount === 1;
  } catch (err) {
    console.log(err);
    return false;
  }
}

/* Eze 4.0 */
export async function createCesta(cesta: CestasInterface): Promise<boolean> {
  try {
    const database = (await conexion).db("tocgame");
    const cestasColeccion = database.collection<CestasInterface>("cestas");
    return (await cestasColeccion.insertOne(cesta)).acknowledged;
  } catch (err) {
    console.log(err);
    return false;
  }
}
