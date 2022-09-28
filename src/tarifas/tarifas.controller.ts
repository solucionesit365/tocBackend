import { Controller, Get } from "@nestjs/common";
import { tarifasInstance } from "./tarifas.class";

@Controller("tarifas")
export class TarifasController {
  @Get("descargarTarifas")
  async descargarTarifas() {
    try {
        return await tarifasInstance.actualizarTarifas();
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
