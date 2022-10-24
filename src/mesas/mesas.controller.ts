import { Body, Controller, Get, Post } from "@nestjs/common";
import { logger } from "../logger";
import { mesasInstance } from "./mesas.class";

@Controller("mesas")
export class MesasController {
  @Get("getMesas")
  async getMesas() {
    try {
      const resultado = await mesasInstance.getMesas();
      if (resultado && resultado.length === 50) return resultado;

      const resActualizar = await mesasInstance.actualizarMesasOnline();
      if (resActualizar) {
        const resultadoActualizado = await mesasInstance.getMesas();
        if (resultadoActualizado && resultadoActualizado.length === 50) {
          return resultadoActualizado;
        }
      }

      const arrayMesas = [];
      for (let i = 0; i < 50; i++) {
        arrayMesas.push({
          color: "#fff",
        });
      }
      return arrayMesas;
    } catch (err) {
      logger.Error(122, err);
    }
  }

  @Post("guardarCambios")
  async saveMesas(@Body() { arrayMesas }) {
    try {
      if (arrayMesas && arrayMesas.length === 50) {
        return await mesasInstance.saveMesasLocal(arrayMesas);
      }
      throw Error(
        "Faltan datos o son incorrectos en guardarCambios mesas.controller.ts"
      );
    } catch (err) {
      logger.Error(124, err);
      return false;
    }
  }
}
