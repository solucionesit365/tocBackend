import { Controller, Post, Body } from "@nestjs/common";
import axios from "axios";
import { parametrosInstance } from "../parametros/parametros.clase";
import { clienteInstance } from "./clientes.clase";
import { ClientesInterface } from "./clientes.interface";
import { logger } from "../logger";

@Controller("clientes")
export class ClientesController {
  /* Eze 4.0 */
  @Post("buscar")
  async buscarCliente(@Body() { busqueda }) {
    try {
      if (busqueda) return await clienteInstance.buscar(busqueda);
      throw Error("Error, faltan datos en buscarCliente() controller");
    } catch (err) {
      logger.Error(65, err);
      return null;
    }
  }

  /* Eze 4.0 */
  @Post("getClienteByID")
  async getClienteByID(@Body() { idCliente }) {
    try {
      if (idCliente) return await clienteInstance.getClienteByID(idCliente);
      throw Error("Error, faltan datos en getClienteByID");
    } catch (err) {
      logger.Error(66, err);
      return null;
    }
  }

  /* Eze 4.0 */
  @Post("descargarClientesFinales")
  async descargarClientesFinales() {
    try {
      const arrayClientes = (await axios.get("clientes/getClientesFinales"))
        .data as ClientesInterface[];
      if (arrayClientes)
        return await clienteInstance.insertarClientes(arrayClientes);
      throw Error(
        "Error, los clientes descargados de San Pedro son null o undefined"
      );
    } catch (err) {
      logger.Error(67, err);
      return false;
    }
  }

  /* Eze 4.0 */
  @Post("crearNuevoCliente")
  async crearNuevoCliente(@Body() { idTarjetaCliente, nombreCliente }) {
    try {
      if (idTarjetaCliente && nombreCliente) {
        if (
          idTarjetaCliente.toString().length > 5 &&
          nombreCliente.length >= 3
        ) {
          const parametros = await parametrosInstance.getParametros();
          const resCrear = await axios.post("clientes/crearNuevoCliente", {
            idTarjetaCliente: idTarjetaCliente,
            nombreCliente: nombreCliente,
            idCliente: `CliBoti_${parametros.codigoTienda}_${Date.now()}`,
            parametros: parametros,
          });

          await this.descargarClientesFinales();

          if (resCrear.data) {
            return true;
          }
          return false;
        }
      }
      throw Error("Error, faltan datos en crearNuevoCliente() controller");
    } catch (err) {
      logger.Error(68, err);
      return false;
    }
  }

  /* Eze 4.0 */
  @Post("consultarPuntos")
  async consultarPuntos(@Body() { idCliente }) {
    try {
      return (
        await axios.post("clientes/getPuntosCliente", {
          idClienteFinal: idCliente,
        })
      ).data;
    } catch (err) {
      logger.Error(134, err);
      return false;
    }
  }
}
