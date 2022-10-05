import * as schClientes from "./clientes.mongodb";
import { ClientesInterface } from "./clientes.interface";
import axios from "axios";
import { parametrosInstance } from "src/parametros/parametros.clase";
import { tarifasInstance } from "src/tarifas/tarifas.class";

export class Clientes {
  /* Eze 4.0. Busca tanto nombres como tarjeta cliente */
  buscar = async (cadena: string) => await schClientes.buscar(cadena);

  /* Eze 4.0 */
  getClienteByID = async (idCliente: string): Promise<ClientesInterface> =>
    await schClientes.getClieneteByID(idCliente);

  /* Eze 4.0 */
  insertarClientes = async (arrayClientes: ClientesInterface[]) =>
    schClientes.insertarClientes(arrayClientes);

  /* Eze 4.0 */
  async getPuntosCliente(
    idClienteFinal: ClientesInterface["id"]
  ): Promise<number> {
    return (
      await axios.post<any>("clientes/getPuntosCliente", {
        database: (await parametrosInstance.getParametros()).database,
        idClienteFinal,
      })
    ).data.info;
  }

  /* Eze 4.0 */
  tieneTarifaEspecial = async (idCliente: ClientesInterface["id"]) => await tarifasInstance.clienteTieneTarifa(idCliente);
}
export const clienteInstance = new Clientes();
