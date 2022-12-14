import { Body, Controller, Post } from "@nestjs/common";
import axios from "axios";
import { movimientosInstance } from "src/movimientos/movimientos.clase";

@Controller("test")
export class TestController {
  @Post("test")
  async imprimirAlgo(@Body() _parms) {
    try {
      return await movimientosInstance.construirArrayVentas();
      return 0;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}
