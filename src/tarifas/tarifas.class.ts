import { TarifaInterface } from "./tarifas.interface";
import * as schTarifas from "./tarifas.mongodb";
import axios from "axios";
import { parametrosInstance } from "../parametros/parametros.clase";

export class TarifasClass {
  /* Eze 4.0 */
  async guardarTarifasEspeciales(
    arrayTarifas: TarifaInterface[]
  ): Promise<boolean> {
    return await schTarifas.insertarTarifas(arrayTarifas);
  }

  /* Eze 4.0 */
  async descargarTarifasEspeciales(): Promise<TarifaInterface[]> {
    const parametros = await parametrosInstance.getParametros();
    const resTarifas = (
      await axios.post("tarifas/getTarifasEspeciales", { database: parametros.database })
    ).data as TarifaInterface[];
    if (resTarifas.length > 0) return resTarifas;
    return [];
  }

  /* Eze 4.0 */
  async actualizarTarifas(): Promise<boolean> {
    await schTarifas.borrarTarifas();
    const arrayTarifas = await this.descargarTarifasEspeciales();
    return await this.guardarTarifasEspeciales(arrayTarifas);
  }
}

export const tarifasInstance = new TarifasClass();
