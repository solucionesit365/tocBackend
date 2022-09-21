import { UtilesModule } from "../utiles/utiles.module";
import { conexion } from "../conexion/mongodb";
import {
  CajaForSincroInterface,
  CajaInterface,
  MonedasInterface,
  tiposInfoMoneda,
} from "./caja.interface";

/* Eze v23 */
export async function getInfoCaja(): Promise<CajaInterface> {
  try {
    const database = (await conexion).db("tocgame");
    const caja = database.collection<CajaInterface>("cajas");
    return await caja.findOne({ _id: "CAJA" });
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function limpiezaCajas(): Promise<boolean> {
  try {
    const database = (await conexion).db("tocgame");
    const sincroCajas = database.collection("sincro-cajas");
    return (
      await sincroCajas.deleteMany({
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
export async function guardarMonedas(
  arrayMonedas: MonedasInterface["array"],
  tipo: tiposInfoMoneda
): Promise<boolean> {
  try {
    const database = (await conexion).db("tocgame");
    const caja = database.collection<MonedasInterface>("infoMonedas");
    const resultado = await caja.updateOne(
      { _id: tipo },
      { $set: { array: arrayMonedas } },
      { upsert: true }
    );
    return resultado.acknowledged && resultado.modifiedCount > 0;
  } catch (err) {
    console.log(err);
    return false;
  }
}

/* Eze v23 */
export async function getUltimoCierre(): Promise<CajaForSincroInterface> {
  try {
    const database = (await conexion).db("tocgame");
    const sincroCajas =
      database.collection<CajaForSincroInterface>("sincro-cajas");
    return await sincroCajas.findOne({ enviado: false }, { sort: { _id: 1 } });
  } catch (err) {
    console.log(err);
    return null;
  }
}

/* Eze v23 */
export async function getMonedas(
  tipo: tiposInfoMoneda
): Promise<MonedasInterface> {
  try {
    const database = (await conexion).db("tocgame");
    const caja = database.collection<MonedasInterface>("infoMonedas");
    return await caja.findOne({ _id: tipo });
  } catch (err) {
    console.log(err);
    return null;
  }
}

/* Eze v23 */
export async function setInfoCaja(data: CajaInterface) {
  try {
    // Si el id no es "CAJA" dará error
    const database = (await conexion).db("tocgame");
    const caja = database.collection<CajaInterface>("cajas");
    const resultado = await caja.updateOne(
      {
        _id: "CAJA",
      },
      { $set: data }
    );

    return resultado.acknowledged && resultado.modifiedCount > 0;
  } catch (err) {
    console.log(err);
    return false;
  }
}

/* Eze v23 */
export async function borrarCaja(): Promise<boolean> {
  try {
    const database = (await conexion).db("tocgame");
    const caja = database.collection("cajas");
    return await caja.drop();
  } catch (err) {
    console.log(err);
    return false;
  }
}

/* Eze v23 */
export async function nuevoItemSincroCajas(unaCaja): Promise<boolean> {
  try {
    const database = (await conexion).db("tocgame");
    const sincroCajas = database.collection("sincro-cajas");
    return (await sincroCajas.insertOne(unaCaja)).acknowledged;
  } catch (err) {
    console.log(err);
    return false;
  }
}

/* Eze v23 */
export async function confirmarCajaEnviada(
  unaCaja: CajaInterface
): Promise<boolean> {
  try {
    const database = (await conexion).db("tocgame");
    const sincroCajas = database.collection("sincro-cajas");
    const resultado = await sincroCajas.updateOne(
      { _id: unaCaja._id },
      {
        $set: {
          enviado: unaCaja.enviado,
        },
      }
    );
    return resultado.acknowledged && resultado.modifiedCount > 0;
  } catch (err) {
    console.log(err);
    return false;
  }
}

/* Eze v23 */
export async function confirmarCajaHabiaLlegado(
  unaCaja: CajaInterface
): Promise<boolean> {
  try {
    const database = (await conexion).db("tocgame");
    const sincroCajas = database.collection("sincro-cajas");
    const resultado = await sincroCajas.updateOne(
      { _id: unaCaja._id },
      {
        $set: {
          enviado: unaCaja.enviado,
          comentario: unaCaja.comentario,
        },
      }
    );
    return resultado.acknowledged && resultado.modifiedCount > 0;
  } catch (err) {
    console.log(err);
    return false;
  }
}

/* Eze v23 */
export async function getCajaMasAntigua(): Promise<CajaForSincroInterface> {
  try {
    const database = (await conexion).db("tocgame");
    const sincroCajas =
      database.collection<CajaForSincroInterface>("sincro-cajas");
    return await sincroCajas.findOne({ enviado: false }, { sort: { _id: 1 } });
  } catch (err) {
    console.log(err);
    return null;
  }
}
