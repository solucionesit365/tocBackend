import { Body, Controller, Post, Get } from "@nestjs/common";
import { trabajadoresInstance } from "./trabajadores.clase";
import { cestasInstance } from "../cestas/cestas.clase";

@Controller("trabajadores")
export class TrabajadoresController {

  /* Eze 4.0 */
  @Get("getTrabajadoresFichados")
  async getTrabajadoresFichados() {
    try {
      return await trabajadoresInstance.getTrabajadoresFichados();
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  /* Eze 4.0 */
  @Post("buscar")
  async buscar(@Body() { busqueda }) {
    try {
      return await trabajadoresInstance.buscar(busqueda);
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  /* Eze 4.0 */
  @Post("fichar")
  async fichar(@Body() { idTrabajador }) {
    try {
      if (idTrabajador) {
        const idCesta = await cestasInstance.crearCesta();
        if (await trabajadoresInstance.setIdCesta(idTrabajador, idCesta))
          return trabajadoresInstance.ficharTrabajador(idTrabajador);
        throw Error("Error, no se ha podido asignar el idCesta nuevo al trabajador. trabajadores controller");
      }
      throw Error("Error, faltan datos en fichar() trabajadores controller");
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  /* Eze 4.0 */
  @Post("desfichar")
  async desfichar(@Body() { idTrabajador }) {
    try {
      if (idTrabajador) return await trabajadoresInstance.desficharTrabajador(idTrabajador);
      throw Error("Error, faltan datos en desfichar() controller");
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  /* Eze 4.0 */
  @Get("actualizarTrabajadores")
  async actualizarTrabajadores() {
    try {
      return await trabajadoresInstance.actualizarTrabajadores();
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  /* Eze 4.0 */
  @Post("inicioDescanso")
  async inicioDescanso(@Body() { idTrabajador }) {
    try {
      if (idTrabajador) return await trabajadoresInstance.inicioDescanso(idTrabajador);
      throw Error("Error, faltan datos en inicioDescanso() controller");
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  /* Eze 4.0 */
  @Post("finDescanso")
  async finDescanso(@Body() { idTrabajador }) {
    try {
      if (idTrabajador) return await trabajadoresInstance.finDescanso(idTrabajador);
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
