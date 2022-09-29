import { Controller, Post, Body } from "@nestjs/common";
import { UtilesModule } from "../utiles/utiles.module";
import { cajaInstance } from "./caja.clase";

@Controller("caja")
export class CajaController {
  @Post("cerrarCaja")
  async cerrarCaja(@Body() { total, detalleMonedas, infoDinero, cantidad3G, idDependienta }) {
    try {
      if (UtilesModule.checkVariable(total, detalleMonedas, infoDinero, cantidad3G, idDependienta)) {
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
      console.log(err);
      return false;
    }
  }

  @Post("abrirCaja")
  abrirCaja(@Body() params) {
    // No probado! Se le pasa solo el array de monedas
    if (params.total != undefined && params.detalle != undefined) {
      return cajaInstance
        .abrirCaja(params)
        .then((res) => {
          if (res) {
            return { error: false };
          } else {
            return { error: true };
          }
        })
        .catch((err) => {
          console.log(err);
          return { error: true };
        });
    } else {
      return {
        error: true,
        mensaje: "Backend: Faltan datos en caja/abrirCaja",
      };
    }
  }

  @Post("estadoCaja")
  estadoCaja() {
    // No probado! Se le pasa solo el array de monedas
    return cajaInstance
      .cajaAbierta()
      .then((res) => {
        if (res) {
          return { abierta: true, error: false };
        } else {
          return { abierta: false, error: false };
        }
      })
      .catch((err) => {
        console.log(err);
        return {
          error: true,
          mensaje: "Backend: Error en caja/estadoCaja CATCH",
        };
      });
  }

  @Post("getMonedasUltimoCierre")
  getMonedasUltimoCierre() {
    // No probado! Se le pasa solo el array de monedas
    return cajaInstance
      .getMonedas("CLAUSURA")
      .then((res) => {
        return { error: false, info: res };
      })
      .catch((err) => {
        console.log(err);
        return {
          error: true,
          mensaje: "Backend: Error en caja/getMonedasUltimoCierre > CATCH",
        };
      });
  }
}
