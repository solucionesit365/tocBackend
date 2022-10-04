import { Controller, Post, Body, Get } from "@nestjs/common";
import { trabajadoresInstance } from "src/trabajadores/trabajadores.clase";
// import { Console } from "console";
import { UtilesModule } from "../utiles/utiles.module";
// import { trabajadoresInstance } from "../trabajadores/trabajadores.clase";
import { cestasInstance } from "./cestas.clase";

@Controller("cestas")
export class CestasController {
  /* Eze 4.0 */
  @Post("borrarCesta")
  async borrarCesta(@Body() { idCesta }) {
    try {
      if (idCesta) return await cestasInstance.borrarArticulosCesta(idCesta);

      throw Error("Error, faltan datos en borrarCesta controller");
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  /* Eze 4.0 */
  @Post("borrarItemCesta")
  async borrarItemCesta(@Body() { idCesta, index }) {
    try {
      if (index && idCesta) return await cestasInstance.borrarItemCesta(idCesta, index)
      throw Error("Error, faltan datos en borrarItemCesta controller");
    } catch (err) {
      console.log(err);
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
      console.log(err);
      return null;
    }
  }

  /* Eze 4.0 */
  @Post("crearCesta")
  async crearCesta(@Body() { idTrabajador }) {
    try {
      if (idTrabajador) return await cestasInstance.crearCesta(idTrabajador);
      throw Error("Error, faltan datos en crearCesta controller");
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  /* Eze 4.0 */
  @Post("cambiarCestaTrabajador")
  async cambiarCestaTrabajador(@Body() { idTrabajador, idCesta }) {
    try {
      if (idCesta && idTrabajador) return await trabajadoresInstance.setIdCesta(idTrabajador, idCesta);
      throw Error("Error, faltan datos en cambiarCestaTrabajador controller");
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  /* Eze 4.0 => Tampoco creo que se utilice con el método de los sockets */
  @Get("getCestas")
  async getCestas() {
    try {
      return await cestasInstance.getAllCestas();
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  /* Eze 4.0 */
  @Post("clickTeclaArticulo")
  async clickTeclaArticulo(@Body() { idArticulo, aPeso, gramos, idCesta, unidades, idCliente, arraySuplementos }) {
    try {
      if (UtilesModule.checkVariable(idArticulo, aPeso, gramos, idCesta, unidades)) {
        return await cestasInstance.clickTeclaArticulo(idArticulo, gramos, idCesta, unidades, idCliente, arraySuplementos);
      }
      throw Error("Faltan datos en cestas (controller) > clickTeclaArticulo");
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  /* Eze 4.0 */
  @Post("regalarProducto")
  async regalarProducto(@Body() { idCesta, index}) {
    try {
      if (idCesta && index) return await cestasInstance.regalarItem(idCesta, index);
      throw Error("Error, faltan datos en regalarProducto controller");
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
