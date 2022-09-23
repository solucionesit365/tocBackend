// 100%
import { CajaSincro, CajaAbiertaInterface, CajaCerradaInterface, MonedasInterface, TiposInfoMoneda, cajaAbiertaVacia, cajaCerradaVacia } from './caja.interface';
import * as schCajas from './caja.mongodb';
import * as schTickets from '../tickets/tickets.mongodb';
import * as schMonedas from '../monedas/monedas.mongodb';
import { TicketsInterface } from '../tickets/tickets.interface';
import { MovimientosInterface } from '../movimientos/movimientos.interface';
import { trabajadoresInstance } from '../trabajadores/trabajadores.clase';
import { parametrosInstance } from '../parametros/parametros.clase';
import { movimientosInstance } from '../movimientos/movimientos.clase';
import { impresoraInstance } from '../impresora/impresora.class';
import { ObjectId } from 'mongodb';

const TIPO_ENTRADA = "ENTRADA";
const TIPO_SALIDA = "SALIDA";

export class CajaClase {

  /* Eze v23 */
  getInfoCajaAbierta() {
    return schCajas.getInfoCajaAbierta();
  }

  /* Eze v23 */
  async cajaAbierta(): Promise<boolean> {
    const infoCaja = await this.getInfoCajaAbierta();
    if (infoCaja) {
      if (infoCaja.inicioTime) return true;
    }
    return false;
  }

  /* Eze v23 */
  confirmarCajaEnviada(caja: CajaSincro) {
    return schCajas.confirmarCajaEnviada(caja);
  }

  /* Eze v23 */
  getCajaSincroMasAntigua() {
    return schCajas.getCajaSincroMasAntigua();
  }

  /* Eze v23 */
  async abrirCaja(detalleApertura: CajaAbiertaInterface["detalleApertura"], totalApertura: CajaAbiertaInterface["totalApertura"], idDependienta: CajaAbiertaInterface["idDependientaApertura"]): Promise<boolean> {
    if (detalleApertura && totalApertura) {
      const cajaNueva: CajaAbiertaInterface = {
        inicioTime: Date.now(),
        detalleApertura: detalleApertura,
        totalApertura: totalApertura,
        idDependientaApertura: idDependienta
      };  
      return await schCajas.setInfoCaja(cajaNueva);
    }
    console.log("Error precondiciones abrirCaja > caja.clase.ts");
    return false;
  }

  /* Eze v23 */
  guardarMonedas(arrayMonedas: MonedasInterface["array"], tipo: TiposInfoMoneda) {
    return schCajas.guardarMonedas(arrayMonedas, tipo);
  }

  /* Eze v23 */
  getMonedas(tipo: TiposInfoMoneda) {
    return schCajas.getMonedas(tipo);
  }

  /* Eze v23 */
  nuevoItemSincroCajas(cajaAbierta: CajaAbiertaInterface, cajaCerrada: CajaCerradaInterface) {
    const cajaInsertar: CajaSincro = {
      _id: new ObjectId(),
      ...cajaAbierta,
      ...cajaCerrada,
      enviado: false

    };
    return schCajas.nuevoItemSincroCajas(cajaInsertar);
  }

  /* Eze v23 */
  async cerrarCaja(totalCierre: CajaCerradaInterface["totalCierre"], detalleCierre: CajaCerradaInterface["detalleCierre"], guardarInfoMonedas: MonedasInterface["array"], totalDatafono3G: CajaCerradaInterface["totalDatafono3G"], idDependientaCierre: CajaCerradaInterface["idDependientaCierre"]) {
    try {
      if (!await this.cajaAbierta()) throw Error("Error al cerrar caja: La caja ya está cerrada");

      const finalTime = Date.now();
      const cajaAbiertaActual = await this.getInfoCajaAbierta();
      const cajaCerradaActual = await this.getDatosCierre(cajaAbiertaActual, totalCierre, detalleCierre, idDependientaCierre, totalDatafono3G, finalTime);
      
      if (!await movimientosInstance.nuevoMovimiento(totalDatafono3G, "", "DATAFONO_3G", null, idDependientaCierre)) throw Error("No se ha podido crear el movimiento 3G");
      if (await this.nuevoItemSincroCajas(cajaAbiertaActual, cajaCerradaActual)) return await schMonedas.setMonedas(guardarInfoMonedas);

      return false;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  /* Eze v23  */
  async borrarCaja() {
    return schCajas.borrarCaja();
  }

  /* Eze v23 */
  getUltimoCierre() {
    return schCajas.getUltimoCierre();
  }

  /* Eze v23 (Faltan tests) */
  async getDatosCierre(cajaAbiertaActual: CajaAbiertaInterface, totalCierre: CajaCerradaInterface["totalCierre"], detalleCierre: CajaCerradaInterface["detalleCierre"], idDependientaCierre: CajaCerradaInterface["idDependientaCierre"], totalDatafono3G: CajaCerradaInterface["totalDatafono3G"], finalTime: CajaCerradaInterface["finalTime"]): Promise<CajaCerradaInterface> {
    try {
      const arrayTicketsCaja: TicketsInterface[] = await schTickets.getTicketsIntervalo(cajaAbiertaActual.inicioTime, finalTime);
      const arrayMovimientos: MovimientosInterface[] = await movimientosInstance.getMovimientosIntervalo(cajaAbiertaActual.inicioTime, finalTime);
    
      let totalTickets = 0;
      let nClientes = 0;
  
      if (arrayTicketsCaja.length <= 0) throw Error("No hay tickets en esta caja");
  
      let totalTarjeta = 0;
      let totalEfectivo = 0;
      let totalSalidas = 0;
      let totalEntradas = 0;
      let recaudado = 0;
      let totalDeuda = 0;
      let totalTkrsConExceso = 0;
      let totalTkrsSinExceso = 0;
      let totalEntregaDiaria = 0;
      let totalEntradaDinero = 0;
      let totalConsumoPersonal = 0;

      /* RECUERDA QUE SE DEBE HACER UN MOVIMIENTO DE SALIDA PARA LA CANTIDAD 3G ANTES DE CERRAR LA CAJA, EN ESTE MOMENTO NO SE HACE */
      for (let i = 0; i < arrayMovimientos.length; i++) {
        switch(arrayMovimientos[i].tipo) {
          case "EFECTIVO": totalEntradas += arrayMovimientos[i].valor; totalEfectivo += arrayMovimientos[i].valor; break;
          case "TARJETA": totalSalidas += arrayMovimientos[i].valor; totalTarjeta += arrayMovimientos[i].valor; break;
          case "TKRS_CON_EXCESO": totalSalidas += arrayMovimientos[i].valor; totalTkrsConExceso += arrayMovimientos[i].valor; break;
          case "TKRS_SIN_EXCESO": totalSalidas += arrayMovimientos[i].valor; totalTkrsSinExceso += arrayMovimientos[i].valor; break;
          case "CONSUMO_PERSONAL": totalSalidas += arrayMovimientos[i].valor; totalConsumoPersonal += arrayMovimientos[i].valor; break;
          case "DEUDA": totalSalidas += arrayMovimientos[i].valor; totalDeuda += arrayMovimientos[i].valor; break;
          case "ENTREGA_DIARIA": totalSalidas += arrayMovimientos[i].valor; totalEntregaDiaria += arrayMovimientos[i].valor; break;
          case "ENTRADA_DINERO": totalEntradas += arrayMovimientos[i].valor; totalEntradaDinero += arrayMovimientos[i].valor; break;
          case "DATAFONO_3G": totalSalidas += arrayMovimientos[i].valor; break;
          default: console.log("Error, tipo de movimiento desconocido");
        }
      }

      totalEfectivo -= totalDatafono3G;

      // ESTO SERÁ PARA CALCULAR EL DESCUADRE
      for (let i = 0; i < arrayTicketsCaja.length; i++) {
        nClientes++;
        totalTickets += arrayTicketsCaja[i].total;
      }

      return {
        calaixFetZ: totalTickets,
        primerTicket: arrayTicketsCaja[0]._id,
        ultimoTicket: arrayTicketsCaja[arrayTicketsCaja.length-1]._id,
        descuadre: Math.round(((totalCierre - cajaAbiertaActual.totalApertura) + totalSalidas - totalEntradaDinero - totalTickets)*100)/100,
        detalleCierre: detalleCierre,
        finalTime: finalTime,
        idDependientaCierre: idDependientaCierre,
        nClientes: nClientes,
        recaudado: recaudado,
        totalCierre: totalCierre,
        totalDatafono3G: totalDatafono3G,
        totalDeuda: totalDeuda,
        totalEfectivo: totalEfectivo,
        totalEntradas: totalEntradas,
        totalSalidas: totalSalidas,
        totalTarjeta: totalTarjeta,
        totalTkrsConExceso: totalTkrsConExceso,
        totalTkrsSinExceso: totalTkrsSinExceso,
        mediaTickets: totalTickets / nClientes,
      }
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}

export const cajaInstance = new CajaClase();
