import { Body, Controller, Post } from "@nestjs/common";
import { io } from "../sockets.gateway";

@Controller("test")
export class TestController {
  @Post("test")
  imprimirAlgo(@Body() parms) {
    io.emit("cargarTrabajadores", "putaqtepario")
  }
}
