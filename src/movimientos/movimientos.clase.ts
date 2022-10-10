import { parametrosInstance } from "../parametros/parametros.clase";
import { MovimientosInterface } from "./movimientos.interface";
import * as schMovimientos from "./movimientos.mongodb";
// import { impresoraInstance } from "../impresora/impresora.class";
// import { trabajadoresInstance } from "../trabajadores/trabajadores.clase";
import { logger } from "../logger";

const moment = require("moment");
const Ean13Utils = require("ean13-lib").Ean13Utils;
// const TIPO_ENTRADA = "ENTRADA";
// const TIPO_SALIDA = "SALIDA";

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
  getMovimientosIntervalo = (inicioTime: number, finalTime: number) =>
    schMovimientos.getMovimientosIntervalo(inicioTime, finalTime);

  /* Eze 4.0 */
  public async nuevoMovimiento(
    valor: MovimientosInterface["valor"],
    concepto: MovimientosInterface["concepto"],
    tipo: MovimientosInterface["tipo"],
    idTicket: MovimientosInterface["idTicket"],
    idTrabajador: MovimientosInterface["idTrabajador"]
  ) {
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
      valor,
    };

    return await schMovimientos.nuevoMovimiento(nuevoMovimiento);
  }

  /* Eze v23 */
  private async generarCodigoBarrasSalida(): Promise<string> {
    try {
      const parametros = await parametrosInstance.getParametros();
      const ultimoCodigoDeBarras = await schMovimientos.getUltimoCodigoBarras();

      if (!ultimoCodigoDeBarras)
        if (!(await schMovimientos.resetContadorCodigoBarras()))
          throw "Error en inicializar contador de codigo de barras";

      let ultimoNumero = await schMovimientos.getUltimoCodigoBarras();

      if (ultimoNumero == 999) {
        if (!(await schMovimientos.resetContadorCodigoBarras()))
          throw "Error en resetContadorCodigoBarras";
      } else if (!(await schMovimientos.actualizarCodigoBarras())) {
        throw "Error en actualizarCodigoBarras";
      }

      ultimoNumero = await schMovimientos.getUltimoCodigoBarras();

      const codigoLicenciaStr = getNumeroTresDigitos(parametros.licencia);
      const strNumeroCodigosDeBarras: string =
        getNumeroTresDigitos(ultimoNumero);
      let codigoFinal = "";
      const digitYear = new Date().getFullYear().toString()[3];

      codigoFinal = `98${codigoLicenciaStr}${digitYear}${getNumeroTresDigitos(
        moment().dayOfYear()
      )}${strNumeroCodigosDeBarras}`;
      return codigoFinal;
    } catch (err) {
      logger.Error(98, err);
      return null;
    }
  }

  /* Eze v23 */
  getMovimientoMasAntiguo = () => schMovimientos.getMovimientoMasAntiguo();

  /* Eze v23 */
  actualizarEstadoMovimiento = (movimiento: MovimientosInterface) =>
    schMovimientos.actualizarEstadoMovimiento(movimiento);
}

export const movimientosInstance = new MovimientosClase();
