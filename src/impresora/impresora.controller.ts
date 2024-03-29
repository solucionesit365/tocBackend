import { Controller, Post, Body } from "@nestjs/common";
import { ObjectId } from "mongodb";
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
  despedirCliente() {
    impresoraInstance.despedirCliente();
  }
  @Post("bienvenida")
  binvenidaCliente() {
    impresoraInstance.bienvenidaCliente();
  }

  @Post("testMqtt")
  async testMqtt() {
    try {
      await impresoraInstance.imprimirDevolucion(
        new ObjectId("639b1ea2d9aff66ec40a6ccf")
      );
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
