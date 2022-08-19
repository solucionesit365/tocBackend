import { Controller, Post, Body } from "@nestjs/common";
import { UtilesModule } from "../utiles/utiles.module";
import { movimientosInstance } from "./movimientos.clase";
@Controller("movimientos")
export class MovimientosController {

  /* Eze v23 - Solo salidas normales, sin ticket relacionado */
  @Post("nuevaSalida")
  nuevaSalida(@Body() params) {
    if (
      params.cantidad != undefined &&
      UtilesModule.checkVariable(params.concepto, params.idTrabajador)
    ) {
      return movimientosInstance.nuevaSalida(
        params.cantidad,
        params.concepto,
        "SALIDA",
        true,
        null,
        params.idTrabajador
      );
    } else {
      return { error: true, mensaje: "Error, faltan datos" };
    }
  }

  /* Eze v23 - Solo entradas normales, sin ticket relacionado */
  @Post("nuevaEntrada")
  nuevaEntrada(@Body() params) {
    if (
      params.cantidad != undefined &&
      UtilesModule.checkVariable(params.concepto, params.idTrabajador)
    )
      return movimientosInstance.nuevaEntrada(
        params.cantidad,
        params.concepto,
        true,
        params.idTrabajador
      );

    return false;
  }
}
