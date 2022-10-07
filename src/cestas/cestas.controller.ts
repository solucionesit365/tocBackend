import { Controller, Post, Body, Get } from "@nestjs/common";
import { trabajadoresInstance } from "src/trabajadores/trabajadores.clase";
import { cestasInstance } from "./cestas.clase";
import { logger } from "../logger";

@Controller("cestas")
export class CestasController {
  /* Eze 4.0 */
  @Post("borrarCesta")
  async borrarCesta(@Body() { idCesta }) {
    try {
      if (idCesta) return await cestasInstance.borrarArticulosCesta(idCesta);

      throw Error("Error, faltan datos en borrarCesta controller");
    } catch (err) {
      logger.Error(err);
      return false;
    }
  }

  /* Eze 4.0 */
  @Post("borrarItemCesta")
  async borrarItemCesta(@Body() { idCesta, index }) {
    try {
      if (index && idCesta)
        return await cestasInstance.borrarItemCesta(idCesta, index);
      throw Error("Error, faltan datos en borrarItemCesta controller");
    } catch (err) {
      logger.Error(err);
      return false;
    }
  }

  /* Eze 4.0  (probablemente no se usará porque irá por socket)*/
  @Post("getCestaById")
  async getCestaByID(@Body() { idCesta }) {
    try {
      if (idCesta) return await cestasInstance.getCestaById(idCesta);

      throw Error("Error, faltan datos en getCestaById() controller");
    } catch (err) {
      logger.Error(err);
      return null;
    }
  }

  /* Eze 4.0 */
  @Post("crearCesta")
  async crearCesta(@Body() { idTrabajador }) {
    try {
      if (idTrabajador) {
        const idCesta = await cestasInstance.crearCesta();
        return await trabajadoresInstance.setIdCesta(idTrabajador, idCesta);
      }
      throw Error("Error, faltan datos en crearCesta controller");
    } catch (err) {
      logger.Error(err);
      return false;
    }
  }

  /* Eze 4.0 */
  @Post("cambiarCestaTrabajador")
  async cambiarCestaTrabajador(@Body() { idTrabajador, idCesta }) {
    try {
      if (idCesta && idTrabajador)
        return await trabajadoresInstance.setIdCesta(idTrabajador, idCesta);
      throw Error("Error, faltan datos en cambiarCestaTrabajador controller");
    } catch (err) {
      logger.Error(err);
      return false;
    }
  }

  /* Eze 4.0 => Tampoco creo que se utilice con el método de los sockets */
  @Get("getCestas")
  async getCestas() {
    try {
      return await cestasInstance.getAllCestas();
    } catch (err) {
      logger.Error(err);
      return null;
    }
  }

  /* Eze 4.0 */
  @Post("regalarProducto")
  async regalarProducto(@Body() { idCesta, index }) {
    try {
      if (idCesta && index)
        return await cestasInstance.regalarItem(idCesta, index);
      throw Error("Error, faltan datos en regalarProducto controller");
    } catch (err) {
      logger.Error(err);
      return false;
    }
  }
}
