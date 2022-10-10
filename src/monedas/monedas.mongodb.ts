import { MonedasInterface } from 'src/caja/caja.interface';
import {conexion} from '../conexion/mongodb';
import { logger } from "../logger";

export async function setMonedas(data: MonedasInterface["array"]): Promise<boolean> {
  try {
    const database = (await conexion).db("tocgame");
    const monedas = database.collection("monedas");
    const resultado = await monedas.updateOne({_id: "INFO_MONEDAS"}, { $set: data }, { upsert: true });
    return (resultado.acknowledged && resultado.modifiedCount > 0);
  } catch (err) {
    logger.Error(97, err);
    return false;
  }
}
