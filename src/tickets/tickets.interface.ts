import { ClientesInterface } from "../clientes/clientes.interface";
import { CestasInterface } from "../cestas/cestas.interface";

export interface TicketsInterface {
  _id: number;
  timestamp: number;
  total: number;
  cesta: CestasInterface;
  idTrabajador: number;
  idCliente: ClientesInterface["id"];
  consumoPersonal?: boolean;
  enviado: boolean;
}
