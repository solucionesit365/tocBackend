import { Controller, Post, Get, Body } from "@nestjs/common";
import { UtilesModule } from "../utiles/utiles.module";
import { cajaInstance } from "./caja.clase";
import { logger } from "../logger";
import { impresoraInstance } from "src/impresora/impresora.class";

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
        ) &&
        typeof cantidad3G === "number"
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
      logger.Error(52, err);
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
      logger.Error(53, err);
      return false;
    }
  }

  /* Eze 4.0 */
  @Get("estadoCaja")
  async estadoCaja() {
    try {
      return await cajaInstance.cajaAbierta();
    } catch (err) {
      logger.Error(54, err);
      return false;
    }
  }

  /* Eze 4.0 */
  @Get("getMonedasUltimoCierre")
  async getMonedasUltimoCierre() {
    try {
      return cajaInstance.getMonedas("CLAUSURA");
    } catch (err) {
      logger.Error(55, err);
      return null;
    }
  }

  /* Eze 4.0 */
  @Get("getUltimoCierre")
  async getUltimoCierre() {
    try {
      return await cajaInstance.getUltimoCierre();
    } catch (err) {
      logger.Error(140, err);
      return false;
    }
  }

  /* Eze 4.0 */
  @Post("imprimirUltimoCierre")
  async imprimirUltimoCierre() {
    try {
      const ultimoCierre = await cajaInstance.getUltimoCierre();
      if (ultimoCierre) impresoraInstance.imprimirCajaAsync(ultimoCierre);

      throw Error("No se ha podido obtener el último cierre");
    } catch (err) {
      logger.Error(144, err);
      return false;
    }
  }
}
