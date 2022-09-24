import { Controller, Post, Body } from "@nestjs/common";
import { UtilesModule } from "../utiles/utiles.module";
import { movimientosInstance } from "./movimientos.clase";
@Controller("movimientos")
export class MovimientosController {
  /* Eze v23 */
  @Post("nuevoMovimiento") // Solo para entradas o salidas manuales (idTicket = null)
  nuevaSalida(@Body() params) {
    if (
      params.cantidad != undefined &&
      UtilesModule.checkVariable(
        params.concepto,
        params.idTrabajador,
        params.tipo
      )
    ) {
      return movimientosInstance.nuevoMovimiento(
        params.cantidad,
        params.concepto,
        params.tipo,
        null,
        params.idTrabajador
      );
    }
    return false;
  }
}
