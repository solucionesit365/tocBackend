import { Controller, Post, Body, Get } from "@nestjs/common";
// import { Console } from "console";
import { UtilesModule } from "../utiles/utiles.module";
// import { trabajadoresInstance } from "../trabajadores/trabajadores.clase";
import { cestasInstance } from "./cestas.clase";

@Controller("cestas")
export class CestasController {
  @Post("borrarCesta")
  borrarCesta(@Body() params) {

  }

  @Post("borrarItemCesta")
  borrarItemCesta(@Body() params) {

  }


  @Post("getCestaById")
  getCestaByID(@Body() params) {

  }


  @Post("crearCesta")
  crearCesta(@Body() params) {

  }

  @Post("cambiarCestaTrabajador")
  cambiarCestaTrabajador(@Body() params) {

  }

  @Get("getCestas")
  getCestas() {
  
  }

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

  @Post("regalarProducto")
  regalarProducto(@Body() params) {

  }
}
