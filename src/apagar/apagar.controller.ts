import { Controller, Get } from "@nestjs/common";
import { apagarinstance } from "./apagar.class";

@Controller("controlTpv")
export class ApagarController {
  @Get()
  apagar() {
    return apagarinstance.apagarEquipo();
  }
}
