import { Controller, Post, Body, Get } from "@nestjs/common";
// import { Console } from "console";
// import { UtilesModule } from "src/utiles/utiles.module";
// import { trabajadoresInstance } from "../trabajadores/trabajadores.clase";
// import { cestasInstance } from "./cestas.clase";

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
  async clickTeclaArticulo(@Body() params) {

  }

  @Post("regalarProducto")
  regalarProducto(@Body() params) {

  }
}
