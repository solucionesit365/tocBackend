// 100%
import { CajaForSincroInterface, CajaInterface } from "./caja.interface";
import * as schCajas from "./caja.mongodb";
import * as schTickets from "../tickets/tickets.mongodb";
import * as schMonedas from "../monedas/monedas.mongodb";
import { TicketsInterface } from "../tickets/tickets.interface";
import { MovimientosInterface } from "../movimientos/movimientos.interface";
import { trabajadoresInstance } from "../trabajadores/trabajadores.clase";
import { parametrosInstance } from "../parametros/parametros.clase";
import { movimientosInstance } from "../movimientos/movimientos.clase";
import { impresoraInstance } from "../impresora/impresora.class";

const TIPO_ENTRADA = 'ENTRADA';
const TIPO_SALIDA = 'SALIDA';
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
        totalDeuda: null
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
    totalClearOne: null
};

export class CajaClase {

    getInfoCaja(): Promise<CajaInterface> {
        return schCajas.getInfoCaja();
    }

    cajaAbierta(): Promise<boolean> {
        return this.getInfoCaja().then((infoCaja) => {
            if (infoCaja == null || infoCaja.inicioTime == null) {
                return false;
            } else {
                return true;
            }
        }).catch((err) => {
            console.log(err);
            return false;
        });
    }

    confirmarCajaEnviada(caja: CajaInterface) {
        return schCajas.confirmarCajaEnviada(caja).then((res) => {
            return res.acknowledged;
        }).catch((err) => {
            console.log(err);
            return false;
        });
    }

    getCajaMasAntigua() {
        return schCajas.getCajaMasAntigua();
    }

    confirmarCajaHabiaLlegado(caja: CajaInterface) {
        return schCajas.confirmarCajaHabiaLlegado(caja).then((res) => {
            return res.acknowledged;
        }).catch((err) => {
            console.log(err);
            return false;
        });
    }

    abrirCaja(infoApertura: any): Promise<boolean> {
        let cajaNueva = cajaVacia;
        cajaNueva.inicioTime = Date.now();
        cajaNueva.detalleApertura = infoApertura.detalle;
        cajaNueva.totalApertura = infoApertura.total;

        return schCajas.setInfoCaja(cajaNueva).then((result) => {
            if (result.acknowledged) {
                return true;
            } else {
                return false;
            }
        }).catch((err) => {
            console.log(err);
            return false;
        });
    }

    guardarMonedas(arrayMonedas: any, tipo: 'APERTURA' | 'CLAUSURA') {
        return schCajas.guardarMonedas(arrayMonedas, tipo).then((res) => {
            return res.acknowledged;
        }).catch((err) => {
            console.log(err);
            return false;
        });
    }

    getMonedas(tipo: 'APERTURA' | 'CLAUSURA') {
        return schCajas.getMonedas(tipo).then((res) => {
            if (res != null) {
                return res.array;
            } else {
                return null;
            }
        }).catch((err) => {
            console.log(err);
            return null;
        });
    }

    nuevoItemSincroCajas(caja: CajaInterface) {
        let cajaInsertar: CajaForSincroInterface | {} = {};
        cajaInsertar['_id'] = Date.now();
        cajaInsertar['inicioTime'] = caja.inicioTime;
        cajaInsertar['finalTime'] = caja.finalTime;
        cajaInsertar['detalleCierre'] = caja.detalleCierre;
        cajaInsertar['idDependienta'] = caja.idDependienta;
        cajaInsertar['totalApertura'] = caja.totalApertura;
        cajaInsertar['totalCierre'] = caja.totalCierre;
        cajaInsertar['descuadre'] = caja.descuadre;
        cajaInsertar['recaudado'] = caja.recaudado;
        cajaInsertar['nClientes'] = caja.nClientes;
        cajaInsertar['primerTicket'] = caja.primerTicket;
        cajaInsertar['infoExtra'] = caja.infoExtra;
        cajaInsertar['ultimoTicket'] = caja.ultimoTicket;
        cajaInsertar['calaixFetZ'] = caja.calaixFetZ;
        cajaInsertar['detalleApertura'] = caja.detalleApertura;
        cajaInsertar['enviado'] = caja.enviado;
        cajaInsertar['enTransito'] = caja.enTransito;
        cajaInsertar['totalDatafono3G'] = caja.totalDatafono3G;
        cajaInsertar['totalClearOne'] = caja.totalClearOne;

        return schCajas.nuevoItemSincroCajas(cajaInsertar);
    }

    async cerrarCaja(total: number, detalleCierre, guardarInfoMonedas, totalDatafono3G: number) { //Promise<boolean> {
        let estaAbierta = await this.cajaAbierta();
        
        if (estaAbierta) {
            let cajaActual: CajaInterface = await this.getInfoCaja();
            cajaActual.totalCierre = total;
            cajaActual.detalleCierre = detalleCierre;
            cajaActual.finalTime = Date.now();
            cajaActual.idDependienta = await trabajadoresInstance.getCurrentIdTrabajador(); // this.getCurrentTrabajador()._id;
            cajaActual.totalDatafono3G = totalDatafono3G;
            cajaActual.totalClearOne = 0;
            cajaActual = await this.calcularDatosCaja(cajaActual);

            const deudaDeliveroo = await schTickets.getDedudaDeliveroo(cajaActual.inicioTime, cajaActual.finalTime);
            const deudaGlovo = await schTickets.getDedudaGlovo(cajaActual.inicioTime, cajaActual.finalTime);
            const totalTkrs = await schTickets.getTotalTkrs(cajaActual.inicioTime, cajaActual.finalTime);
    
            let objEmail = {
                caja: cajaActual,
                nombreTienda: parametrosInstance.getParametros().nombreTienda,
                nombreDependienta: (await trabajadoresInstance.getCurrentTrabajador()).nombre,
                arrayMovimientos: await movimientosInstance.getMovimientosIntervalo(cajaActual.inicioTime, cajaActual.finalTime), // ipcRenderer.sendSync('get-rango-movimientos', {fechaInicio: cajaActual.inicioTime, fechaFinal: cajaActual.finalTime}),
                deudaGlovo: deudaGlovo,
                deudaDeliveroo: deudaDeliveroo,
                totalTkrs: totalTkrs
            }

            const res = await this.nuevoItemSincroCajas(cajaActual);
            if (res.acknowledged) {
                // ipcRenderer.send('enviar-email', objEmail);
                const res2 = await schMonedas.setMonedas({
                    _id: "INFO_MONEDAS",
                    infoDinero: guardarInfoMonedas
                });
                if (res2.acknowledged) {
                    if (await this.borrarCaja()) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    borrarCaja() {
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

    async calcularDatosCaja(unaCaja: CajaInterface): Promise<CajaInterface> {
        var arrayTicketsCaja: TicketsInterface[] = await schTickets.getTicketsIntervalo(unaCaja.inicioTime, unaCaja.finalTime);
        var arrayMovimientos: MovimientosInterface[] = await movimientosInstance.getMovimientosIntervalo(unaCaja.inicioTime, unaCaja.finalTime);
        var totalTickets = 0;
        var nombreTrabajador = (await trabajadoresInstance.getCurrentTrabajador()).nombre;
        var descuadre = 0;
        var nClientes = 0;
        const params = parametrosInstance.getParametros();
        let currentCaja = cajaVacia;
        let cajaDirectaBBDD = await this.getInfoCaja();
        currentCaja["detalleApertura"] = cajaDirectaBBDD.detalleApertura;
        currentCaja["inicioTime"] = cajaDirectaBBDD.inicioTime;
        currentCaja["totalApertura"] = cajaDirectaBBDD.totalApertura;
        currentCaja["enviado"] = false;
        currentCaja["finalTime"] = unaCaja.finalTime;
        if(arrayTicketsCaja.length > 0) {
            currentCaja.primerTicket = arrayTicketsCaja[0]._id;
            currentCaja.ultimoTicket = arrayTicketsCaja[arrayTicketsCaja.length-1]._id;
        }
        
        var nombreTienda = params.nombreTienda;
        var fechaInicio = currentCaja.inicioTime;
        var totalTarjeta = 0;
        var totalEnEfectivo = 0;
        var cambioInicial = currentCaja.totalApertura;
        var cambioFinal = unaCaja.totalCierre;
        var totalSalidas = 0;
        var totalEntradas = 0;
        var recaudado = 0; //this.caja.totalCierre-this.caja.totalApertura + totalSalidas - totalEntradas;
        var totalDeuda = 0;

        for(let i = 0; i < arrayMovimientos.length; i++) {
            if(arrayMovimientos[i].tipo === TIPO_SALIDA) {
                if(arrayMovimientos[i].tipoExtra != 'CONSUMO_PERSONAL') {
                    totalSalidas += arrayMovimientos[i].valor;
                }                
            } else {
                if(arrayMovimientos[i].tipo === TIPO_ENTRADA) {
                    totalEntradas += arrayMovimientos[i].valor;
                }
            }
        }
        for(let i = 0; i < arrayTicketsCaja.length; i++) {
            nClientes++;
            totalTickets += arrayTicketsCaja[i].total;
            
            switch(arrayTicketsCaja[i].tipoPago) {
                case "TARJETA": totalTarjeta += arrayTicketsCaja[i].total; break;
                case "EFECTIVO": 
                    recaudado += arrayTicketsCaja[i].total;
                    totalEnEfectivo += arrayTicketsCaja[i].total;
                    break;
                case "DEUDA": totalDeuda += arrayTicketsCaja[i].total; break;
                case "TICKET_RESTAURANT": 
                    recaudado += arrayTicketsCaja[i].total;
                    totalEnEfectivo += arrayTicketsCaja[i].total;
                    break;
            }
        }
        
        currentCaja['calaixFetZ'] = totalTickets;
        currentCaja.infoExtra['cambioFinal'] = cambioFinal;
        currentCaja.infoExtra['cambioInicial'] = cambioInicial;
        currentCaja.infoExtra['totalSalidas'] = totalSalidas;
        currentCaja.infoExtra['totalEntradas'] = totalEntradas;
        currentCaja.infoExtra['totalEnEfectivo'] = totalEnEfectivo-unaCaja.totalDatafono3G;
        currentCaja.infoExtra['totalTarjeta'] = totalTarjeta;
        currentCaja.infoExtra['totalDeuda'] = totalDeuda;
        descuadre = cambioFinal-cambioInicial+totalSalidas-totalEntradas-totalTickets+unaCaja.totalDatafono3G;
        recaudado = totalTickets + descuadre - totalTarjeta - totalDeuda;
        
        const objImpresion = {
            calaixFet: totalTickets,
            nombreTrabajador: nombreTrabajador,
            descuadre: descuadre,
            nClientes: nClientes,
            recaudado: recaudado,
            arrayMovimientos: arrayMovimientos,
            nombreTienda: nombreTienda,
            fechaInicio: fechaInicio,
            fechaFinal: currentCaja.finalTime,
            totalSalidas: totalSalidas,
            totalEntradas: totalEntradas,
            cInicioCaja: cambioInicial,
            cFinalCaja: cambioFinal,
            impresora: params.tipoImpresora,
            totalTarjeta: totalTarjeta
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
        }
        catch(err) {
            // vueToast.abrir('error', 'Impresora no detectada');
            console.log(err);
        }
        
        unaCaja.descuadre = descuadre;
        unaCaja.nClientes = nClientes;
        unaCaja.recaudado = recaudado;
        unaCaja.primerTicket = currentCaja.primerTicket;
        unaCaja.ultimoTicket = currentCaja.ultimoTicket;
        unaCaja.infoExtra = currentCaja.infoExtra;
        unaCaja.calaixFetZ = currentCaja.calaixFetZ;
        return unaCaja;
    }
}

export const cajaInstance = new CajaClase();
