import { UtilesModule } from "../utiles/utiles.module";
import { conexion } from "../conexion/mongodb";
import {
  CajaAbiertaInterface,
  CajaSincro,
  MonedasInterface,
  TiposInfoMoneda,
} from "./caja.interface";
import { ObjectId, ObjectID } from "bson";

/* Eze v23 */
export async function getInfoCajaAbierta(): Promise<CajaAbiertaInterface> {
  try {
    const database = (await conexion).db("tocgame");
    const caja = database.collection<CajaAbiertaInterface>("caja");
    return await caja.findOne();
  } catch (err) {
    console.log(err);
    return null;
  }
}

/* Eze v23 */
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
  tipo: TiposInfoMoneda
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
export async function getUltimoCierre(): Promise<CajaSincro> {
  try {
    const database = (await conexion).db("tocgame");
    const sincroCajas =
      database.collection<CajaSincro>("sincro-cajas");
    return await sincroCajas.findOne({ enviado: false }, { sort: { _id: 1 } });
  } catch (err) {
    console.log(err);
    return null;
  }
}

/* Eze v23 */
export async function getMonedas(
  tipo: TiposInfoMoneda
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
export async function setInfoCaja(data: CajaAbiertaInterface) {
  try {
    const database = (await conexion).db("tocgame");
    const caja = database.collection<CajaAbiertaInterface>("caja");
    const resultado = await caja.updateMany(
      {},
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
    const caja = database.collection("caja");
    return await caja.drop();
  } catch (err) {
    console.log(err);
    return false;
  }
}

/* Eze v23 */
export async function nuevoItemSincroCajas(caja: CajaSincro): Promise<boolean> {
  try {
    const database = (await conexion).db("tocgame");
    const sincroCajas = database.collection("sincro-cajas");
    return (await sincroCajas.insertOne(caja)).acknowledged;
  } catch (err) {
    console.log(err);
    return false;
  }
}

/* Eze v23 */
export async function confirmarCajaEnviada(
  caja: CajaSincro
): Promise<boolean> {
  try {
    const database = (await conexion).db("tocgame");
    const sincroCajas = database.collection("sincro-cajas");
    const resultado = await sincroCajas.updateOne(
      { _id: caja._id },
      {
        $set: {
          enviado: caja.enviado,
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
export async function getCajaSincroMasAntigua(): Promise<CajaSincro> {
  try {
    const database = (await conexion).db("tocgame");
    const sincroCajas =
      database.collection<CajaSincro>("sincro-cajas");
    return await sincroCajas.findOne({ enviado: false }, { sort: { finalTime: 1 } });
  } catch (err) {
    console.log(err);
    return null;
  }
}
