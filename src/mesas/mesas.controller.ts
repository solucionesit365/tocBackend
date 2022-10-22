import { Controller, Get } from "@nestjs/common";
import { logger } from "../logger";
import { mesasInstance } from "./mesas.class";

@Controller("mesas")
export class MesasController {
  @Get("getMesas")
  async getMesas() {
    try {
      return await mesasInstance.getMesas();
    } catch (err) {
      logger.Error(122, err);
    }
  }
}
