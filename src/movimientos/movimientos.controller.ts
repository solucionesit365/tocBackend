import { Controller, Post, Body } from "@nestjs/common";
import { UtilesModule } from "../utiles/utiles.module";
import { movimientosInstance } from "./movimientos.clase";
import { logger } from "../logger";

@Controller("movimientos")
export class MovimientosController {
  /* Eze 4.0 */
  @Post("nuevoMovimiento") // Solo para entradas o salidas manuales (idTicket = null)
  nuevoMovimiento(@Body() { cantidad, concepto, idTrabajador, tipo }) {
    try {
      if (
        cantidad != undefined &&
        UtilesModule.checkVariable(concepto, idTrabajador, tipo)
      ) {
        return movimientosInstance.nuevoMovimiento(
          cantidad,
          concepto,
          tipo,
          null,
          idTrabajador
        );
      }
      throw Error("Error, faltan datos en nuevoMovimiento() controller");
    } catch (err) {
      logger.Error(99, err);
      return false;
    }
  }

  @Post("getMovimientosIntervalo")
  async getMovimientosIntervalo(@Body() { inicio, final }) {
    try {
      if (inicio && final)
        return await movimientosInstance.getMovimientosIntervalo(inicio, final);
      else throw Error("Faltan datos en movimientos/getMovimientosIntervalo");
    } catch (err) {
      logger.Error(142, err);
      return false;
    }
  }
}
