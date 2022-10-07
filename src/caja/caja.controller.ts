import { Controller, Post, Get, Body } from "@nestjs/common";
import { UtilesModule } from "../utiles/utiles.module";
import { cajaInstance } from "./caja.clase";
import { logger } from "../logger";

@Controller("caja")
export class CajaController {
  /* Eze 4.0 */
  @Post("cerrarCaja")
  async cerrarCaja(
    @Body() { total, detalleMonedas, infoDinero, cantidad3G, idDependienta }
  ) {
    try {
      if (
        UtilesModule.checkVariable(
          total,
          detalleMonedas,
          infoDinero,
          cantidad3G,
          idDependienta
        )
      ) {
        return await cajaInstance.cerrarCaja(
          total,
          detalleMonedas,
          infoDinero,
          cantidad3G,
          idDependienta
        );
      }
      throw Error("Error cerrarCaja > Faltan datos");
    } catch (err) {
      logger.Error(err);
      return false;
    }
  }

  /* Eze 4.0 */
  @Post("abrirCaja")
  async abrirCaja(@Body() { total, detalle, idDependienta }) {
    try {
      if (total != undefined && detalle != undefined)
        return await cajaInstance.abrirCaja({
          detalleApertura: detalle,
          idDependientaApertura: idDependienta,
          inicioTime: Date.now(),
          totalApertura: total,
        });
      throw Error("Error abrirCaja > Faltan datos o son incorrectos");
    } catch (err) {
      logger.Error(err);
      return false;
    }
  }

  /* Eze 4.0 */
  @Post("estadoCaja")
  async estadoCaja() {
    try {
      return await cajaInstance.cajaAbierta();
    } catch (err) {
      logger.Error(err);
      return false;
    }
  }

  /* Eze 4.0 */
  @Get("getMonedasUltimoCierre")
  async getMonedasUltimoCierre() {
    try {
      return cajaInstance.getMonedas("CLAUSURA");
    } catch (err) {
      logger.Error(err);
      return null;
    }
  }
}
