import { Controller, Post, Body } from "@nestjs/common";
import { UtilesModule } from "src/utiles/utiles.module";
import { devolucionesInstance } from "./devoluciones.clase";

@Controller("devoluciones")
export class DevolucionesController {
  /* Eze v23 */
  @Post("nuevaDevolucion")
  nuevaDevolucion(@Body() params) {
    if (
      params.total != undefined &&
      UtilesModule.checkVariable(params.idCesta, params.idTrabajador)
    )
      return devolucionesInstance.nuevaDevolucion(
        params.total,
        params.idCesta,
        params.idTrabajador
      );

    return false;
  }
}
