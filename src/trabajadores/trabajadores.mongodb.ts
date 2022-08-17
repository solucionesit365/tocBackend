import { UtilesModule } from "../utiles/utiles.module";
import { conexion } from "../conexion/mongodb";
import {
  SincroFichajesInterface,
  TrabajadoresInterface,
} from "./trabajadores.interface";

/* Eze v23 */
export async function limpiezaFichajes(): Promise<boolean> {
  try {
    const database = (await conexion).db("tocgame");
    const fichajes = database.collection("sincro-fichajes");
    return (
      await fichajes.deleteMany({
        enviado: true,
        _id: { $lte: UtilesModule.restarDiasTimestamp(Date.now()) },
      })
    ).acknowledged;
  } catch (err) {
    console.log(err);
    return false;
  }
}

/* Eze v23 */
export async function buscar(
  busqueda: string
): Promise<TrabajadoresInterface[]> {
  try {
    const database = (await conexion).db("tocgame");
    const trabajadores = database.collection("trabajadores");
    return (await trabajadores
      .find(
        {
          $or: [
            { nombre: { $regex: new RegExp(busqueda, "i") } },
            { nombreCorto: { $regex: new RegExp(busqueda, "i") } },
          ],
        },
        { limit: 4 }
      )
      .toArray()) as TrabajadoresInterface[];
  } catch (err) {
    console.log(err);
    return [];
  }
}

/* Eze v23 */
export async function getTrabajador(
  idTrabajador: number
): Promise<TrabajadoresInterface> {
  try {
    const database = (await conexion).db("tocgame");
    const trabajadores = database.collection("trabajadores");
    return (await trabajadores.findOne({
      _id: idTrabajador,
    })) as TrabajadoresInterface;
  } catch (err) {
    console.log(err);
    return null;
  }
}

/* Eze v23 */
export async function getTrabajadoresFichados(): Promise<
  TrabajadoresInterface[]
> {
  try {
    const database = (await conexion).db("tocgame");
    const trabajadores = database.collection("trabajadores");
    return (await trabajadores
      .find({ fichado: true })
      .toArray()) as TrabajadoresInterface[];
  } catch (err) {
    console.log(err);
    return [];
  }
}

/* Eze v23 */
export async function ficharTrabajador(
  idTrabajador: number,
  idCesta: number
): Promise<boolean> {
  try {
    const database = (await conexion).db("tocgame");
    const trabajadores = database.collection("trabajadores");
    return (
      await trabajadores.updateOne(
        { _id: idTrabajador },
        { $set: { fichado: true, idCesta } }
      )
    ).acknowledged;
  } catch (err) {
    console.log(err);
    return false;
  }
}

/* Eze v23 */
export async function desficharTrabajador(
  idTrabajador: number
): Promise<boolean> {
  try {
    const database = (await conexion).db("tocgame");
    const trabajadores = database.collection("trabajadores");
    return (
      await trabajadores.updateOne(
        { _id: idTrabajador },
        { $set: { fichado: false } }
      )
    ).acknowledged;
  } catch (err) {
    console.log(err);
    return false;
  }
}

/* Eze v23 */
export async function inicioDescanso(idTrabajador: number): Promise<boolean> {
  try {
    const database = (await conexion).db("tocgame");
    const trabajadores = database.collection("trabajadores");
    return (
      await trabajadores.updateOne(
        { _id: idTrabajador },
        { $set: { fichado: false, descansando: true } }
      )
    ).acknowledged;
  } catch (err) {
    console.log(err);
    return false;
  }
}

/* Eze v23 */
export async function finalDescanso(idTrabajador: number): Promise<boolean> {
  try {
    const database = (await conexion).db("tocgame");
    const trabajadores = database.collection("trabajadores");
    return (
      await trabajadores.updateOne(
        { _id: idTrabajador },
        { $set: { fichado: true, descansando: false } }
      )
    ).acknowledged;
  } catch (err) {
    console.log(err);
    return false;
  }
}

/* Eze v23 */
export async function insertNuevoFichaje(data): Promise<boolean> {
  try {
    const database = (await conexion).db("tocgame");
    const sincrofichajes = database.collection("sincro-fichajes");
    const resultado = (await sincrofichajes.insertOne(data)).acknowledged;
    return resultado;
  } catch (err) {
    console.log(err);
    return false;
  }
}

/* Eze v23 */
export async function buscarTrabajadoresFichados() {
  try {
    const database = (await conexion).db("tocgame");
    const trabajadores = database.collection("trabajadores");
    const resultado = (await (
      await trabajadores.find({ fichado: true })
    ).toArray()) as TrabajadoresInterface[];

    return resultado;
  } catch (err) {
    console.log(err);
    return [];
  }
}

/* Eze v23 */
export async function borrarTrabajadores() {
  try {
    const database = (await conexion).db("tocgame");
    const trabajadores = database.collection("trabajadores");
    return await trabajadores.drop();
  } catch (err) {
    if (err.codeName == "NamespaceNotFound") return true;

    return false;
  }
}

/* Eze v23 */
export async function insertarTrabajadores(
  arrayTrabajadores
): Promise<boolean> {
  try {
    if (await borrarTrabajadores()) {
      const database = (await conexion).db("tocgame");
      const trabajadores = database.collection("trabajadores");
      const resultado = (await trabajadores.insertMany(arrayTrabajadores))
        .acknowledged;
      return resultado;
    } else {
      throw Error("No se ha podido borrar la lista de trabajadores");
    }
  } catch (err) {
    console.log(err);
    return false;
  }
}

/* Eze v23 */
export async function getFichajeMasAntiguo(): Promise<SincroFichajesInterface> {
  try {
    const database = (await conexion).db("tocgame");
    const sincroFichajes = database.collection("sincro-fichajes");
    const resultado = (await sincroFichajes.findOne(
      { enviado: false },
      { sort: { _id: 1 } }
    )) as SincroFichajesInterface;
    return resultado;
  } catch (err) {
    console.log(err);
    return null;
  }
}

/* Eze v23 */
export async function actualizarEstadoFichaje(
  fichaje: SincroFichajesInterface
): Promise<boolean> {
  try {
    const database = (await conexion).db("tocgame");
    const sincroFichajes = database.collection("sincro-fichajes");
    return (
      await sincroFichajes.updateOne(
        { _id: fichaje._id },
        {
          $set: {
            enviado: fichaje.enviado,
          },
        }
      )
    ).acknowledged;
  } catch (err) {
    console.log(err);
    return false;
  }
}
