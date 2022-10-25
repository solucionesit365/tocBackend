import { Controller, Get } from "@nestjs/common";
import { logger } from "src/logger";
import { nuevaInstancePromociones } from "./promociones.clase";

@Controller("promociones")
export class PromocionesController {
  @Get("descargarPromociones")
  async descargarPromociones() {
    try {
      return await nuevaInstancePromociones.descargarPromociones();
    } catch (err) {
      logger.Error(127, err);
      return false;
    }
  }
}
