import { Controller, Post, Body, Get } from "@nestjs/common";
import { trabajadoresInstance } from "src/trabajadores/trabajadores.clase";
import { cestasInstance } from "./cestas.clase";
import { logger } from "../logger";
import { UtilesModule } from "src/utiles/utiles.module";

@Controller("cestas")
export class CestasController {
  /* Eze 4.0 */
  @Post("borrarCesta")
  async borrarCesta(@Body() { idCesta }) {
    try {
      if (idCesta) return await cestasInstance.borrarArticulosCesta(idCesta);

      throw Error("Error, faltan datos en borrarCesta controller");
    } catch (err) {
      logger.Error(58, err);
      return false;
    }
  }

  /* Eze 4.0 */
  @Post("borrarItemCesta")
  async borrarItemCesta(@Body() { idCesta, index }) {
    console.log(idCesta, index);
    try {
      if (UtilesModule.checkVariable(index, idCesta))
        return await cestasInstance.borrarItemCesta(idCesta, index);
      throw Error("Error, faltan datos en borrarItemCesta controller");
    } catch (err) {
      logger.Error(59, err);
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
      logger.Error(60, err);
      return null;
    }
  }

  /* Eze 4.0 */
  @Post("crearCesta")
  async crearCesta(@Body() { idTrabajador }) {
    try {
      if (idTrabajador) {
        const idCesta = await cestasInstance.crearCesta();
        if (await trabajadoresInstance.setIdCesta(idTrabajador, idCesta)) {
          cestasInstance.actualizarCestas();
          trabajadoresInstance.actualizarTrabajadoresFrontend();
          return true;
        }
      }
      throw Error("Error, faltan datos en crearCesta controller");
    } catch (err) {
      logger.Error(61, err);
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
      logger.Error(62, err);
      return false;
    }
  }

  /* Eze 4.0 => Tampoco creo que se utilice con el método de los sockets */
  @Get("getCestas")
  async getCestas() {
    try {
      return await cestasInstance.getAllCestas();
    } catch (err) {
      logger.Error(63, err);
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
      logger.Error(64, err);
      return false;
    }
  }
}
