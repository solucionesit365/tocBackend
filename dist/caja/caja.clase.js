"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cajaInstance = exports.CajaClase = void 0;
const schCajas = require("./caja.mongodb");
const schTickets = require("../tickets/tickets.mongodb");
const schMonedas = require("../monedas/monedas.mongodb");
const trabajadores_clase_1 = require("../trabajadores/trabajadores.clase");
const parametros_clase_1 = require("../parametros/parametros.clase");
const movimientos_clase_1 = require("../movimientos/movimientos.clase");
const impresora_class_1 = require("../impresora/impresora.class");
const TIPO_ENTRADA = 'ENTRADA';
const TIPO_SALIDA = 'SALIDA';
const cajaVacia = {
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
class CajaClase {
    getInfoCaja() {
        return schCajas.getInfoCaja();
    }
    cajaAbierta() {
        return this.getInfoCaja().then((infoCaja) => {
            if (infoCaja == null || infoCaja.inicioTime == null) {
                return false;
            }
            else {
                return true;
            }
        }).catch((err) => {
            console.log(err);
            return false;
        });
    }
    confirmarCajaEnviada(caja) {
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
    confirmarCajaHabiaLlegado(caja) {
        return schCajas.confirmarCajaHabiaLlegado(caja).then((res) => {
            return res.acknowledged;
        }).catch((err) => {
            console.log(err);
            return false;
        });
    }
    abrirCaja(infoApertura) {
        let cajaNueva = cajaVacia;
        cajaNueva.inicioTime = Date.now();
        cajaNueva.detalleApertura = infoApertura.detalle;
        cajaNueva.totalApertura = infoApertura.total;
        return schCajas.setInfoCaja(cajaNueva).then((result) => {
            if (result.acknowledged) {
                return true;
            }
            else {
                return false;
            }
        }).catch((err) => {
            console.log(err);
            return false;
        });
    }
    guardarMonedas(arrayMonedas, tipo) {
        return schCajas.guardarMonedas(arrayMonedas, tipo).then((res) => {
            return res.acknowledged;
        }).catch((err) => {
            console.log(err);
            return false;
        });
    }
    getMonedas(tipo) {
        return schCajas.getMonedas(tipo).then((res) => {
            if (res != null) {
                return res.array;
            }
            else {
                return null;
            }
        }).catch((err) => {
            console.log(err);
            return null;
        });
    }
    nuevoItemSincroCajas(caja) {
        let cajaInsertar = {};
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
    async cerrarCaja(total, detalleCierre, guardarInfoMonedas, totalDatafono3G) {
        let estaAbierta = await this.cajaAbierta();
        if (estaAbierta) {
            let cajaActual = await this.getInfoCaja();
            cajaActual.totalCierre = total;
            cajaActual.detalleCierre = detalleCierre;
            cajaActual.finalTime = Date.now();
            cajaActual.idDependienta = await trabajadores_clase_1.trabajadoresInstance.getCurrentIdTrabajador();
            cajaActual.totalDatafono3G = totalDatafono3G;
            cajaActual.totalClearOne = 0;
            cajaActual = await this.calcularDatosCaja(cajaActual);
            const deudaDeliveroo = await schTickets.getDedudaDeliveroo(cajaActual.inicioTime, cajaActual.finalTime);
            const deudaGlovo = await schTickets.getDedudaGlovo(cajaActual.inicioTime, cajaActual.finalTime);
            const totalTkrs = await schTickets.getTotalTkrs(cajaActual.inicioTime, cajaActual.finalTime);
            let objEmail = {
                caja: cajaActual,
                nombreTienda: parametros_clase_1.parametrosInstance.getParametros().nombreTienda,
                nombreDependienta: (await trabajadores_clase_1.trabajadoresInstance.getCurrentTrabajador()).nombre,
                arrayMovimientos: await movimientos_clase_1.movimientosInstance.getMovimientosIntervalo(cajaActual.inicioTime, cajaActual.finalTime),
                deudaGlovo: deudaGlovo,
                deudaDeliveroo: deudaDeliveroo,
                totalTkrs: totalTkrs
            };
            const res = await this.nuevoItemSincroCajas(cajaActual);
            if (res.acknowledged) {
                const res2 = await schMonedas.setMonedas({
                    _id: "INFO_MONEDAS",
                    infoDinero: guardarInfoMonedas
                });
                if (res2.acknowledged) {
                    if (await this.borrarCaja()) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }
    borrarCaja() {
        return schCajas.borrarCaja().then((result) => {
            if (result) {
                return true;
            }
            else {
                return false;
            }
        }).catch((err) => {
            console.log(err);
            return false;
        });
    }
    async calcularDatosCaja(unaCaja) {
        var arrayTicketsCaja = await schTickets.getTicketsIntervalo(unaCaja.inicioTime, unaCaja.finalTime);
        var arrayMovimientos = await movimientos_clase_1.movimientosInstance.getMovimientosIntervalo(unaCaja.inicioTime, unaCaja.finalTime);
        var totalTickets = 0;
        var nombreTrabajador = (await trabajadores_clase_1.trabajadoresInstance.getCurrentTrabajador()).nombre;
        var descuadre = 0;
        var nClientes = 0;
        const params = parametros_clase_1.parametrosInstance.getParametros();
        let currentCaja = cajaVacia;
        let cajaDirectaBBDD = await this.getInfoCaja();
        currentCaja["detalleApertura"] = cajaDirectaBBDD.detalleApertura;
        currentCaja["inicioTime"] = cajaDirectaBBDD.inicioTime;
        currentCaja["totalApertura"] = cajaDirectaBBDD.totalApertura;
        currentCaja["enviado"] = false;
        currentCaja["finalTime"] = unaCaja.finalTime;
        if (arrayTicketsCaja.length > 0) {
            currentCaja.primerTicket = arrayTicketsCaja[0]._id;
            currentCaja.ultimoTicket = arrayTicketsCaja[arrayTicketsCaja.length - 1]._id;
        }
        var nombreTienda = params.nombreTienda;
        var fechaInicio = currentCaja.inicioTime;
        var totalTarjeta = 0;
        var totalEnEfectivo = 0;
        var cambioInicial = currentCaja.totalApertura;
        var cambioFinal = unaCaja.totalCierre;
        var totalSalidas = 0;
        var totalEntradas = 0;
        var recaudado = 0;
        var totalDeuda = 0;
        for (let i = 0; i < arrayMovimientos.length; i++) {
            if (arrayMovimientos[i].tipo === TIPO_SALIDA) {
                if (arrayMovimientos[i].tipoExtra != 'CONSUMO_PERSONAL') {
                    totalSalidas += arrayMovimientos[i].valor;
                }
            }
            else {
                if (arrayMovimientos[i].tipo === TIPO_ENTRADA) {
                    totalEntradas += arrayMovimientos[i].valor;
                }
            }
        }
        for (let i = 0; i < arrayTicketsCaja.length; i++) {
            nClientes++;
            totalTickets += arrayTicketsCaja[i].total;
            switch (arrayTicketsCaja[i].tipoPago) {
                case "TARJETA":
                    totalTarjeta += arrayTicketsCaja[i].total;
                    break;
                case "EFECTIVO":
                    recaudado += arrayTicketsCaja[i].total;
                    totalEnEfectivo += arrayTicketsCaja[i].total;
                    break;
                case "DEUDA":
                    totalDeuda += arrayTicketsCaja[i].total;
                    break;
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
        currentCaja.infoExtra['totalEnEfectivo'] = totalEnEfectivo - unaCaja.totalDatafono3G;
        currentCaja.infoExtra['totalTarjeta'] = totalTarjeta;
        currentCaja.infoExtra['totalDeuda'] = totalDeuda;
        descuadre = cambioFinal - cambioInicial + totalSalidas - totalEntradas - totalTickets + unaCaja.totalDatafono3G;
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
        try {
            impresora_class_1.impresoraInstance.imprimirCaja(objImpresion.calaixFet, objImpresion.nombreTrabajador, objImpresion.descuadre, objImpresion.nClientes, objImpresion.recaudado, objImpresion.arrayMovimientos, objImpresion.nombreTienda, objImpresion.fechaInicio, objImpresion.fechaFinal, objImpresion.cInicioCaja, objImpresion.cFinalCaja, objImpresion.impresora);
        }
        catch (err) {
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
exports.CajaClase = CajaClase;
exports.cajaInstance = new CajaClase();
//# sourceMappingURL=caja.clase.js.map