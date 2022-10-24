import axios from "axios";
import { MesaInterface } from "./mesas.interface";
import * as schMesas from "./mesas.mongodb";
export class MesasClass {
  getMesas = async () => await schMesas.getMesas();

  async actualizarMesasOnline() {
    const resMesas: any = await axios.get("mesas/getEstructuraMesas");
    if (resMesas.data) {
      const arrayMesas = resMesas.data.estructura as MesaInterface[];
      if (arrayMesas.length === 0)
        throw Error("Error, se intentaría insertar un array vacío de mesas");
      return await schMesas.insertMesas(arrayMesas);
    }
    throw Error("Error, no se han podido descargar las mesas");
  }

  async saveMesasLocal(arrayMesas: MesaInterface[]) {
    if (await schMesas.insertMesas(arrayMesas)) {
      return this.saveMesasOnline(arrayMesas);
    }
  }

  private async saveMesasOnline(arrayMesas: MesaInterface[]) {
    const resSave = (await axios.post("mesas/saveMesas", { arrayMesas })).data;
    if (resSave) return true;

    console.log("GUARDAR EN SINCRO GENERAL");
    return true; // TEMPORAL
  }
}
export const mesasInstance = new MesasClass();
