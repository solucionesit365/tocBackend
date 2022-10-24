import axios from "axios";
import { MesaInterface } from "./mesas.interface";
import * as schMesas from "./mesas.mongodb";
export class MesasClass {
  getMesas = async () => await schMesas.getMesas();
  saveMesas = async (arrayMesas: MesaInterface[]) =>
    await schMesas.insertMesas(arrayMesas);
}
export const mesasInstance = new MesasClass();
