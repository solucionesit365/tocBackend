import { parametrosInstance } from "../parametros/parametros.clase";
import { MovimientosInterface } from "./movimientos.interface";
import * as schMovimientos from "./movimientos.mongodb";
import { impresoraInstance } from "../impresora/impresora.class";
import { trabajadoresInstance } from "../trabajadores/trabajadores.clase";

const moment = require("moment");
const Ean13Utils = require("ean13-lib").Ean13Utils;
const TIPO_ENTRADA = "ENTRADA";
const TIPO_SALIDA = "SALIDA";

function getNumeroTresDigitos(x: number) {
  let devolver = "";
  if (x < 100 && x >= 10) {
    devolver = "0" + x;
  } else {
    if (x < 10 && x >= 0) {
      devolver = "00" + x;
    } else {
      devolver = x.toString();
    }
  }
  return devolver;
}

export class MovimientosClase {
  /* Eze v23 */
  getMovimientosIntervalo(
    inicioTime: number,
    finalTime: number
  ) {
    return schMovimientos.getMovimientosIntervalo(inicioTime, finalTime);
  }

  /* Eze v23 */
  public async nuevoMovimiento(valor: MovimientosInterface["valor"], concepto: MovimientosInterface["concepto"], tipo: MovimientosInterface["tipo"], idTicket: MovimientosInterface["idTicket"], idTrabajador: MovimientosInterface["idTrabajador"]) {
    let codigoBarras = "";

    if (tipo === "ENTREGA_DIARIA") {
      codigoBarras = await this.generarCodigoBarrasSalida();
      codigoBarras = String(Ean13Utils.generate(codigoBarras));
    }

    const nuevoMovimiento: MovimientosInterface = {
      _id: Date.now(),
      codigoBarras,
      concepto,
      enviado: false,
      idTicket,
      idTrabajador,
      tipo,
      valor
    };

    return await schMovimientos.nuevoMovimiento(nuevoMovimiento);
  }

  private async generarCodigoBarrasSalida() {
    const parametros = await parametrosInstance.getParametros();
    const ultimoCodigoDeBarras = await schMovimientos.getUltimoCodigoBarras();
    if (ultimoCodigoDeBarras == null) {
      if (
        (await schMovimientos.resetContadorCodigoBarras()).acknowledged == false
      ) {
        throw "Error en inicializar contador de codigo de barras";
      }
    }

    let objCodigoBarras = (await schMovimientos.getUltimoCodigoBarras()).ultimo;
    if (objCodigoBarras == 999) {
      const resResetContador = await schMovimientos.resetContadorCodigoBarras();
      if (!resResetContador.acknowledged) {
        throw "Error en resetContadorCodigoBarras";
      }
    } else {
      const resActualizarContador =
        await schMovimientos.actualizarCodigoBarras();
      if (!resActualizarContador.acknowledged) {
        throw "Error en actualizarCodigoBarras";
      }
    }

    objCodigoBarras = (await schMovimientos.getUltimoCodigoBarras()).ultimo;

    const codigoLicenciaStr: string = getNumeroTresDigitos(parametros.licencia);
    const strNumeroCodigosDeBarras: string =
      getNumeroTresDigitos(objCodigoBarras);
    let codigoFinal: string = "";
    const digitYear = new Date().getFullYear().toString()[3];

    codigoFinal = `98${codigoLicenciaStr}${digitYear}${getNumeroTresDigitos(
      moment().dayOfYear()
    )}${strNumeroCodigosDeBarras}`;
    return codigoFinal;
  }

  getMovimientoMasAntiguo() {
    return schMovimientos.getMovimientoMasAntiguo();
  }

  actualizarEstadoMovimiento(movimiento: MovimientosInterface) {
    return schMovimientos
      .actualizarEstadoMovimiento(movimiento)
      .then((res) => {
        return res.acknowledged;
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  }
}

export const movimientosInstance = new MovimientosClase();
