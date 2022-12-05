import { Controller, Post, Body } from "@nestjs/common";
import { logger } from "../logger";
import { impresoraInstance } from "./impresora.class";

@Controller("impresora")
export class ImpresoraController {
  @Post("imprimirTicket")
  async imprimirTicket(@Body() { idTicket }) {
    try {
      if (idTicket) {
        await impresoraInstance.imprimirTicket(idTicket);
        return true;
      }
      throw Error("Faltan datos en impresora/imprimirTicket");
    } catch (err) {
      logger.Error(139, err);
      return false;
    }
  }

  @Post("abrirCajon")
  abrirCajon() {
    impresoraInstance.abrirCajon();
  }

  @Post("imprimirEntregas")
  imprimirEntregas() {
    return impresoraInstance.imprimirEntregas();
  }

  @Post("despedida")
  despedircliente() {
    impresoraInstance.despedircliente();
  }
  @Post("bienvenida")
  binvenidacliente() {
    impresoraInstance.binvenidacliente();
  }
}
