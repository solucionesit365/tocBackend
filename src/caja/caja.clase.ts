// 100%
import {CajaForSincroInterface, CajaInterface, MonedasInterface, tiposInfoMoneda} from './caja.interface';
import * as schCajas from './caja.mongodb';
import * as schTickets from '../tickets/tickets.mongodb';
import * as schMonedas from '../monedas/monedas.mongodb';
import {TicketsInterface} from '../tickets/tickets.interface';
import {MovimientosInterface} from '../movimientos/movimientos.interface';
import {trabajadoresInstance} from '../trabajadores/trabajadores.clase';
import {parametrosInstance} from '../parametros/parametros.clase';
import {movimientosInstance} from '../movimientos/movimientos.clase';
import {impresoraInstance} from '../impresora/impresora.class';

const TIPO_ENTRADA = "ENTRADA";
const TIPO_SALIDA = "SALIDA";

const cajaVacia: CajaInterface = {
  _id: "CAJA",
  inicioTime: null,
  finalTime: null,
  idDependienta: null,
  totalApertura: null,
  totalCierre: null,
  calaixFetZ: null,
  descuadre: null,
  infoExtra: {
    cambioInicial: null,
    cambioFinal: null,
    totalSalidas: null,
    totalEntradas: null,
    totalEnEfectivo: null,
    totalTarjeta: null,
    totalDeuda: null,
  },
  primerTicket: null,
  ultimoTicket: null,
  recaudado: null,
  nClientes: null,
  detalleApertura: [],
  detalleCierre: [],
  enviado: false,
  enTransito: false,
  totalDatafono3G: null,
};

export class CajaClase {

  /* Eze v23 */
  getInfoCaja() {
    return schCajas.getInfoCaja();
  }

  /* Eze v23 */
  async cajaAbierta(): Promise<boolean> {
    const infoCaja = await this.getInfoCaja();
    if (infoCaja) {
      if (infoCaja.inicioTime) return true;
    }
    return false;
  }

  /* Eze v23 */
  confirmarCajaEnviada(caja: CajaInterface) {
    return schCajas.confirmarCajaEnviada(caja);
  }

  /* Eze v23 */
  getCajaMasAntigua() {
    return schCajas.getCajaMasAntigua();
  }

  /* Eze v23 */
  confirmarCajaHabiaLlegado(caja: CajaInterface) {
    return schCajas.confirmarCajaHabiaLlegado(caja);
  }

  /* Eze v23 */
  async abrirCaja(detalleApertura: CajaInterface["detalleApertura"], totalApertura: CajaInterface["totalApertura"]): Promise<boolean> {
    if (detalleApertura && totalApertura) {
      const cajaNueva = cajaVacia;
      cajaNueva.inicioTime = Date.now();
      cajaNueva.detalleApertura = detalleApertura;
      cajaNueva.totalApertura = totalApertura;
  
      return await schCajas.setInfoCaja(cajaNueva);
    }
    console.log("Error precondiciones abrirCaja > caja.clase.ts");
    return false;
  }

  /* Eze v23 */
  guardarMonedas(arrayMonedas: MonedasInterface["array"], tipo: tiposInfoMoneda) {
    return schCajas.guardarMonedas(arrayMonedas, tipo);
  }

  /* Eze v23 */
  getMonedas(tipo: tiposInfoMoneda) {
    return schCajas.getMonedas(tipo);
  }

  /* Eze v23 */
  nuevoItemSincroCajas(caja: CajaInterface) {
    const cajaInsertar: CajaForSincroInterface = {
      _id: Date.now(),
      inicioTime: caja.inicioTime,
      finalTime: caja.finalTime,
      detalleCierre: caja.detalleCierre,
      idDependienta: caja.idDependienta,
      totalApertura: caja.totalApertura,
      totalCierre: caja.totalCierre,
      descuadre: caja.descuadre,
      recaudado: caja.recaudado,
      nClientes: caja.nClientes,
      primerTicket: caja.primerTicket,
      infoExtra: caja.infoExtra,
      ultimoTicket: caja.ultimoTicket,
      calaixFetZ: caja.calaixFetZ,
      detalleApertura: caja.detalleApertura,
      enviado: caja.enviado,
      totalDatafono3G: caja.totalDatafono3G
    };
    return schCajas.nuevoItemSincroCajas(cajaInsertar);
  }

  /*  */
  async cerrarCaja(total: number, detalleCierre: CajaInterface["detalleCierre"], guardarInfoMonedas: MonedasInterface["array"], totalDatafono3G: number, idTrabajador: number) {
    try {
      if (!await this.cajaAbierta()) throw Error("Error al cerrar caja: La caja ya está cerrada");

        const cajaActual = await this.getInfoCaja();
        cajaActual.totalCierre = total;
        cajaActual.detalleCierre = detalleCierre;
        cajaActual.finalTime = Date.now();
        cajaActual.idDependienta = idTrabajador;
        cajaActual.totalDatafono3G = totalDatafono3G;

        cajaActual = await this.getDatosCierre(cajaActual);

        const res = await this.nuevoItemSincroCajas(cajaActual);

        if (res.acknowledged) {
          const res2 = await schMonedas.setMonedas({
            _id: 'INFO_MONEDAS',
            infoDinero: guardarInfoMonedas,
          });
          if (res2.acknowledged) {
            if (await this.borrarCaja()) return true;
          }
        }

      return false;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async borrarCaja(): Promise<boolean> {
    return schCajas.borrarCaja().then((result) => {
      if (result) {
        return true;
      } else {
        return false;
      }
    }).catch((err) => {
      console.log(err);
      return false;
    });
  }

  getUltimoCierre() {
    return schCajas.getUltimoCierre();
  }

  /*  */
  async getDatosCierre(caja: CajaInterface): Promise<CajaInterface> {
    const arrayTicketsCaja: TicketsInterface[] = await schTickets.getTicketsIntervalo(caja.inicioTime, caja.finalTime);
    const arrayMovimientos: MovimientosInterface[] = await movimientosInstance.getMovimientosIntervalo(caja.inicioTime, caja.finalTime);
    const params = await parametrosInstance.getParametros();
    const nombreTrabajador = (await trabajadoresInstance.getTrabajadorById(caja.idDependienta)).nombre;

    let totalTickets = 0;
    let descuadre = 0;
    let nClientes = 0;

    caja.enviado = false;

    if (arrayTicketsCaja.length > 0) {
      caja.primerTicket = arrayTicketsCaja[0]._id;
      caja.ultimoTicket = arrayTicketsCaja[arrayTicketsCaja.length-1]._id;
    }

    let totalTarjeta = 0;
    let totalEnEfectivo = 0;
    let totalSalidas = 0;
    let totalEntradas = 0;
    let recaudado = 0;
    let totalDeuda = 0;

    for (let i = 0; i < arrayMovimientos.length; i++) {
      switch(arrayMovimientos[i].tipo) {
        case "EFECTIVO": totalEntradas += arrayMovimientos[i].valor; break;
        case "TARJETA": totalSalidas += arrayMovimientos[i].valor; break;
        case "TKRS_CON_EXCESO": totalSalidas += arrayMovimientos[i].valor; break;
        case "TKRS_SIN_EXCESO": totalSalidas += arrayMovimientos[i].valor; break;
        case "CONSUMO_PERSONAL": totalSalidas += arrayMovimientos[i].valor; break;
        case "DEUDA": totalSalidas += arrayMovimientos[i].valor; break;
        default: console.log("Error, tipo de movimiento desconocido");
      }
    }

    for (let i = 0; i < arrayTicketsCaja.length; i++) {
      if (arrayTicketsCaja[i].total >= 0) nClientes++;

      totalTickets += arrayTicketsCaja[i].total;

      switch (arrayTicketsCaja[i].tipoPago) {
        case 'TARJETA': totalTarjeta += arrayTicketsCaja[i].total; break;
        case 'EFECTIVO':
          recaudado += arrayTicketsCaja[i].total;
          totalEnEfectivo += arrayTicketsCaja[i].total;
          break;
        case 'DEUDA': totalDeuda += arrayTicketsCaja[i].total; break;
        case 'TICKET_RESTAURANT':
          recaudado += arrayTicketsCaja[i].total;
          totalEnEfectivo += arrayTicketsCaja[i].total;
          break;
      }
    }

    datosCaja['calaixFetZ'] = totalTickets;
    datosCaja.infoExtra['cambioFinal'] = cambioFinal;
    datosCaja.infoExtra['cambioInicial'] = cambioInicial;
    datosCaja.infoExtra['totalSalidas'] = totalSalidas;
    datosCaja.infoExtra['totalEntradas'] = totalEntradas;
    datosCaja.infoExtra['totalEnEfectivo'] = totalEnEfectivo-caja.totalDatafono3G;
    datosCaja.infoExtra['totalTarjeta'] = totalTarjeta;
    datosCaja.infoExtra['totalDeuda'] = totalDeuda;
    descuadre = Math.round((cambioFinal-cambioInicial+totalSalidas-totalEntradas-totalTickets+caja.totalDatafono3G)*100)/100;
    recaudado = totalTickets + descuadre - totalTarjeta - totalDeuda;

    const objImpresion = {
      calaixFet: totalTickets,
      nombreTrabajador: nombreTrabajador,
      nombreTienda: params.nombreTienda,
      descuadre: descuadre,
      nClientes: nClientes,
      recaudado: recaudado,
      arrayMovimientos: arrayMovimientos,
      fechaInicio: fechaInicio,
      fechaFinal: datosCaja.finalTime,
      totalSalidas: totalSalidas,
      totalEntradas: totalEntradas,
      cInicioCaja: cambioInicial,
      cFinalCaja: cambioFinal,
      impresora: params.tipoImpresora,
      totalTarjeta: totalTarjeta,
    };

    // vuePantallaCierre.setVariables(objImpresion); ESTO ENVÍA EL DETALLE DEL CIERRE AL FRONTEND

    try {
      impresoraInstance.imprimirCaja(
          objImpresion.calaixFet,
          objImpresion.nombreTrabajador,
          objImpresion.descuadre,
          objImpresion.nClientes,
          objImpresion.recaudado,
          objImpresion.arrayMovimientos,
          objImpresion.nombreTienda,
          objImpresion.fechaInicio,
          objImpresion.fechaFinal,
          objImpresion.cInicioCaja,
          objImpresion.cFinalCaja,
          objImpresion.impresora,
      );
    } catch (err) {
      // vueToast.abrir('error', 'Impresora no detectada');
      console.log(err);
    }

    caja.descuadre = descuadre;
    caja.nClientes = nClientes;
    caja.recaudado = recaudado;
    caja.primerTicket = datosCaja.primerTicket;
    caja.ultimoTicket = datosCaja.ultimoTicket;
    caja.infoExtra = datosCaja.infoExtra;
    caja.calaixFetZ = datosCaja.calaixFetZ;
    return caja;
  }
}

export const cajaInstance = new CajaClase();
