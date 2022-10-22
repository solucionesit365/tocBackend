import axios from "axios";
import { parametrosInstance } from "../parametros/parametros.clase";
import { MesaInterface } from "./mesas.interface";
import * as schMesas from "./mesas.mongodb";
export class MesasClass {
  getMesas = async () => await schMesas.getMesas();

  async actualizarMesasOnline() {
    const parametros = await parametrosInstance.getParametros();
    const resMesas: any = await axios.post("mesas/getEstructuraMesas", {
      token: parametros.token,
    });
    if (resMesas.data) {
      const arrayMesas = resMesas.data.estructura as MesaInterface[];
      if (arrayMesas.length === 0)
        throw Error("Error, se intentaría insertar un array vacío de mesas");
      return await schMesas.insertMesas(arrayMesas);
    }
    throw Error("Error, no se han podido descargar las mesas");
  }
}
export const mesasInstance = new MesasClass();
