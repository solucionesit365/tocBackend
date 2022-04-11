"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.impresoraInstance = exports.Impresora = void 0;
const articulos_clase_1 = require("../articulos/articulos.clase");
const params_ticket_class_1 = require("../params-ticket/params-ticket.class");
const tickets_clase_1 = require("../tickets/tickets.clase");
const trabajadores_clase_1 = require("../trabajadores/trabajadores.clase");
const clientes_clase_1 = require("../clientes/clientes.clase");
const parametros_clase_1 = require("../parametros/parametros.clase");
const dispositivos_1 = require("../dispositivos");
const devoluciones_clase_1 = require("../devoluciones/devoluciones.clase");
const axios_1 = require("axios");
const dispositivos = new dispositivos_1.Dispositivos();
const escpos = require('escpos');
const exec = require('child_process').exec;
const os = require('os');
escpos.USB = require('escpos-usb');
escpos.Serial = require('escpos-serialport');
escpos.Screen = require('escpos-screen');
const TIPO_ENTRADA_DINERO = 'ENTRADA';
const TIPO_SALIDA_DINERO = 'SALIDA';
function permisosImpresora() {
    try {
        exec(`  echo sa | sudo -S chmod 777 -R /dev/bus/usb/
        echo sa | sudo -S chmod 777 -R /dev/ttyS0
        echo sa | sudo -S chmod 777 -R /dev/ttyS1
        echo sa | sudo -S chmod 777 -R /dev/    
    `);
    }
    catch (err) {
        console.log(err);
    }
}
function dateToString2(fecha) {
    var fechaFinal = null;
    if (typeof fecha === 'string' || typeof fecha === 'number') {
        fechaFinal = new Date(fecha);
    }
    let finalYear = `${fechaFinal.getFullYear()}`;
    let finalMonth = `${fechaFinal.getMonth() + 1}`;
    let finalDay = `${fechaFinal.getDate()}`;
    let finalHours = `${fechaFinal.getHours()}`;
    let finalMinutes = `${fechaFinal.getMinutes()}`;
    let finalSeconds = `${fechaFinal.getSeconds()}`;
    if (finalMonth.length === 1) {
        finalMonth = '0' + finalMonth;
    }
    if (finalDay.length === 1) {
        finalDay = '0' + finalDay;
    }
    if (finalHours.length === 1) {
        finalHours = '0' + finalHours;
    }
    if (finalMinutes.length === 1) {
        finalMinutes = '0' + finalMinutes;
    }
    if (finalSeconds.length === 1) {
        finalSeconds = '0' + finalSeconds;
    }
    return `${finalYear}-${finalMonth}-${finalDay} ${finalHours}:${finalMinutes}:${finalSeconds}`;
}
class Impresora {
    async imprimirTicket(idTicket, esDevolucion = false) {
        const paramsTicket = await params_ticket_class_1.paramsTicketInstance.getParamsTicket();
        let infoTicket;
        if (!esDevolucion) {
            infoTicket = await tickets_clase_1.ticketsInstance.getTicketByID(idTicket);
        }
        else {
            infoTicket = await devoluciones_clase_1.devolucionesInstance.getDevolucionByID(idTicket);
        }
        const infoTrabajador = await trabajadores_clase_1.trabajadoresInstance.getTrabajador(infoTicket.idTrabajador);
        const parametros = parametros_clase_1.parametrosInstance.getParametros();
        var sendObject;
        if (infoTicket != null) {
            if (infoTicket.cliente != null && infoTicket.tipoPago != 'DEUDA' && infoTicket.cliente != undefined) {
                const infoClienteAux = await clientes_clase_1.clienteInstance.getClienteByID(infoTicket.cliente);
                const infoCliente = infoClienteAux;
                var auxNombre = '';
                var puntosCliente = 0;
                if (infoCliente != null) {
                    auxNombre = infoCliente.nombre;
                    puntosCliente = await clientes_clase_1.clienteInstance.getPuntosCliente(infoTicket.cliente);
                }
                else {
                    auxNombre = '';
                }
                sendObject = {
                    numFactura: infoTicket._id,
                    arrayCompra: infoTicket.lista,
                    total: infoTicket.total,
                    visa: infoTicket.tipoPago,
                    tiposIva: infoTicket.tiposIva,
                    cabecera: paramsTicket[0] !== undefined ? paramsTicket[0].valorDato : '',
                    pie: paramsTicket[1] !== undefined ? paramsTicket[1].valorDato : '',
                    nombreTrabajador: (infoTrabajador.nombreCorto != null) ? (infoTrabajador.nombreCorto) : (''),
                    impresora: parametros.tipoImpresora,
                    infoClienteVip: infoTicket.infoClienteVip,
                    infoCliente: {
                        nombre: auxNombre,
                        puntos: puntosCliente
                    }
                };
                this._venta(sendObject);
            }
            else {
                sendObject = {
                    numFactura: infoTicket._id,
                    arrayCompra: infoTicket.lista,
                    total: infoTicket.total,
                    visa: infoTicket.tipoPago,
                    tiposIva: infoTicket.tiposIva,
                    cabecera: paramsTicket[0] !== undefined ? paramsTicket[0].valorDato : '',
                    pie: paramsTicket[1] !== undefined ? paramsTicket[1].valorDato : '',
                    nombreTrabajador: (infoTrabajador.nombreCorto != null) ? (infoTrabajador.nombreCorto) : (''),
                    impresora: parametros.tipoImpresora,
                    infoClienteVip: infoTicket.infoClienteVip,
                    infoCliente: null
                };
                this._venta(sendObject);
            }
        }
    }
    async _venta(info) {
        const numFactura = info.numFactura;
        const arrayCompra = info.arrayCompra;
        const total = info.total;
        const tipoPago = info.visa;
        const tiposIva = info.tiposIva;
        const cabecera = info.cabecera;
        const pie = info.pie;
        const nombreDependienta = info.nombreTrabajador;
        const tipoImpresora = info.impresora;
        const infoClienteVip = info.infoClienteVip;
        const infoCliente = info.infoCliente;
        try {
            permisosImpresora();
            const device = await dispositivos.getDevice();
            if (device == null) {
                throw 'Error controlado: El dispositivo es null';
            }
            var printer = new escpos.Printer(device);
            var detalles = '';
            var pagoTarjeta = '';
            var pagoTkrs = '';
            var detalleClienteVip = '';
            var detalleNombreCliente = '';
            var detallePuntosCliente = '';
            if (infoClienteVip && infoClienteVip.esVip) {
                detalleClienteVip = `Nom: ${infoClienteVip.nombre}\nNIF: ${infoClienteVip.nif}\nCP: ${infoClienteVip.cp}\nCiutat: ${infoClienteVip.ciudad}\nAdr: ${infoClienteVip.direccion}\n`;
            }
            if (infoCliente != null) {
                detalleNombreCliente = infoCliente.nombre;
                detallePuntosCliente = 'PUNTOS: ' + infoCliente.puntos;
            }
            for (let i = 0; i < arrayCompra.length; i++) {
                if (arrayCompra[i].promocion.esPromo) {
                    let nombrePrincipal = (await articulos_clase_1.articulosInstance.getInfoArticulo(arrayCompra[i].promocion.infoPromo.idPrincipal)).nombre;
                    nombrePrincipal = "Oferta " + nombrePrincipal;
                    while (nombrePrincipal.length < 20) {
                        nombrePrincipal += ' ';
                    }
                    detalles += `${arrayCompra[i].unidades * arrayCompra[i].promocion.infoPromo.cantidadPrincipal}     ${nombrePrincipal.slice(0, 20)}       ${arrayCompra[i].promocion.infoPromo.precioRealPrincipal.toFixed(2)}\n`;
                    if (arrayCompra[i].promocion.infoPromo.cantidadSecundario > 0) {
                        let nombreSecundario = (await articulos_clase_1.articulosInstance.getInfoArticulo(arrayCompra[i].promocion.infoPromo.idSecundario)).nombre;
                        nombreSecundario = "Oferta " + nombreSecundario;
                        while (nombreSecundario.length < 20) {
                            nombreSecundario += ' ';
                        }
                        detalles += `${arrayCompra[i].unidades * arrayCompra[i].promocion.infoPromo.cantidadSecundario}     ${nombreSecundario.slice(0, 20)}       ${arrayCompra[i].promocion.infoPromo.precioRealSecundario.toFixed(2)}\n`;
                    }
                }
                else {
                    if (arrayCompra[i].nombre.length < 20) {
                        while (arrayCompra[i].nombre.length < 20) {
                            arrayCompra[i].nombre += ' ';
                        }
                    }
                    detalles += `${arrayCompra[i].unidades}     ${arrayCompra[i].nombre.slice(0, 20)}       ${arrayCompra[i].subtotal.toFixed(2)}\n`;
                }
            }
            var fecha = new Date();
            if (tipoPago == "TARJETA") {
                pagoTarjeta = '----------- PAGADO CON TARJETA ---------\n';
            }
            if (tipoPago == "TICKET_RESTAURANT") {
                pagoTkrs = '----- PAGADO CON TICKET RESTAURANT -----\n';
            }
            var pagoDevolucion = '';
            if (tipoPago == "DEVOLUCION") {
                pagoDevolucion = '-- ES DEVOLUCION --\n';
            }
            var detalleIva4 = '';
            var detalleIva10 = '';
            var detalleIva21 = '';
            var detalleIva = '';
            if (tiposIva.importe1 > 0) {
                detalleIva4 = `${tiposIva.base1.toFixed(2)}        4%: ${tiposIva.valorIva1.toFixed(2)}      ${tiposIva.importe1.toFixed(2)}\n`;
            }
            if (tiposIva.importe2 > 0) {
                detalleIva10 = `${tiposIva.base2.toFixed(2)}        10%: ${tiposIva.valorIva2.toFixed(2)}      ${tiposIva.importe2.toFixed(2)}\n`;
            }
            if (tiposIva.importe3 > 0) {
                detalleIva21 = `${tiposIva.base3.toFixed(2)}       21%: ${tiposIva.valorIva3.toFixed(2)}      ${tiposIva.importe3.toFixed(2)}\n`;
            }
            detalleIva = detalleIva4 + detalleIva10 + detalleIva21;
            var infoConsumoPersonal = '';
            if (tipoPago == "CONSUMO_PERSONAL") {
                infoConsumoPersonal = '---------------- Dte. 100% --------------';
                detalleIva = '';
            }
            device.open(function () {
                printer
                    .encode('latin1')
                    .font('a')
                    .style('b')
                    .size(0, 0)
                    .text(cabecera)
                    .text(`Data: ${fecha.getDate()}-${fecha.getMonth() + 1}-${fecha.getFullYear()}  ${(fecha.getHours() < 10 ? '0' : '') + fecha.getHours()}:${(fecha.getMinutes() < 10 ? '0' : '') + fecha.getMinutes()}`)
                    .text('Factura simplificada N: ' + numFactura)
                    .text('Ates per: ' + nombreDependienta)
                    .text(detalleClienteVip)
                    .text(detalleNombreCliente)
                    .text(detallePuntosCliente)
                    .control('LF')
                    .control('LF')
                    .control('LF')
                    .control('LF')
                    .text('Quantitat      Article        Import (EUR)')
                    .text('-----------------------------------------')
                    .align('LT')
                    .text(detalles)
                    .align('CT')
                    .text(pagoTarjeta)
                    .text(pagoTkrs)
                    .align('LT')
                    .text(infoConsumoPersonal)
                    .size(1, 1)
                    .text(pagoDevolucion)
                    .text('TOTAL: ' + total.toFixed(2) + ' EUR \n')
                    .size(0, 0)
                    .align('CT')
                    .text('Base IVA         IVA         IMPORT')
                    .text(detalleIva)
                    .text('-- ES COPIA --')
                    .text(pie)
                    .control('LF')
                    .control('LF')
                    .control('LF')
                    .cut('PAPER_FULL_CUT')
                    .close();
            });
        }
        catch (err) {
            console.log("Error impresora: ", err);
        }
    }
    async imprimirSalida(cantidad, fecha, nombreTrabajador, nombreTienda, concepto, tipoImpresora, codigoBarras) {
        try {
            const fechaStr = dateToString2(fecha);
            permisosImpresora();
            const device = await dispositivos.getDevice();
            const options = { encoding: "GB18030" };
            const printer = new escpos.Printer(device, options);
            device.open(function () {
                printer
                    .font('a')
                    .style('b')
                    .align('CT')
                    .size(0, 0)
                    .text(nombreTienda)
                    .text(fechaStr)
                    .text("Dependienta: " + nombreTrabajador)
                    .text("Retirada efectivo: " + cantidad)
                    .size(1, 1)
                    .text(cantidad)
                    .size(0, 0)
                    .text("Concepto")
                    .size(1, 1)
                    .text(concepto)
                    .text('')
                    .barcode(codigoBarras.slice(0, 12), "EAN13", 4)
                    .text('')
                    .text('')
                    .text('')
                    .cut()
                    .close();
            });
        }
        catch (err) {
            console.log(err);
        }
    }
    async imprimirEntrada(totalIngresado, fecha, nombreDependienta) {
        const parametros = parametros_clase_1.parametrosInstance.getParametros();
        try {
            const fechaStr = dateToString2(fecha);
            permisosImpresora();
            const device = await dispositivos.getDevice();
            var options = { encoding: "GB18030" };
            var printer = new escpos.Printer(device, options);
            device.open(function () {
                printer
                    .font('a')
                    .style('b')
                    .align('CT')
                    .size(0, 0)
                    .text(parametros.nombreTienda)
                    .text(fechaStr)
                    .text("Dependienta: " + nombreDependienta)
                    .text("Ingreso efectivo: " + totalIngresado)
                    .size(1, 1)
                    .text(totalIngresado)
                    .size(0, 0)
                    .text('')
                    .size(1, 1)
                    .text('')
                    .text('')
                    .text('')
                    .cut()
                    .close();
            });
        }
        catch (err) {
            console.log(err);
        }
    }
    async imprimirTest() {
        const parametros = parametros_clase_1.parametrosInstance.getParametros();
        try {
            permisosImpresora();
            const device = await dispositivos.getDevice();
            var options = { encoding: "GB18030" };
            var printer = new escpos.Printer(device, options);
            device.open(function () {
                printer
                    .font('a')
                    .style('b')
                    .align('CT')
                    .size(1, 1)
                    .text("HOLA HOLA")
                    .cut()
                    .close();
            });
        }
        catch (err) {
            console.log(err);
        }
    }
    async imprimirCaja(calaixFet, nombreTrabajador, descuadre, nClientes, recaudado, arrayMovimientos, nombreTienda, fI, fF, cInicioCaja, cFinalCaja, tipoImpresora) {
        try {
            var fechaInicio = new Date(fI);
            var fechaFinal = new Date(fF);
            var sumaTarjetas = 0;
            var textoMovimientos = '';
            for (let i = 0; i < arrayMovimientos.length; i++) {
                var auxFecha = new Date(arrayMovimientos[i]._id);
                if (arrayMovimientos[i].tipo === TIPO_SALIDA_DINERO) {
                    if (arrayMovimientos[i].concepto == 'Targeta' || arrayMovimientos[i].concepto == 'Targeta 3G') {
                        sumaTarjetas += arrayMovimientos[i].valor;
                    }
                    else {
                        textoMovimientos += `${i + 1}: Salida:\n           Cantidad: -${arrayMovimientos[i].valor.toFixed(2)}\n           Fecha: ${auxFecha.getDate()}/${auxFecha.getMonth()}/${auxFecha.getFullYear()}  ${auxFecha.getHours()}:${auxFecha.getMinutes()}\n           Concepto: ${arrayMovimientos[i].concepto}\n`;
                    }
                }
                if (arrayMovimientos[i].tipo === TIPO_ENTRADA_DINERO) {
                    textoMovimientos += `${i + 1}: Entrada:\n            Cantidad: +${arrayMovimientos[i].valor.toFixed(2)}\n            Fecha: ${auxFecha.getDate()}/${auxFecha.getMonth()}/${auxFecha.getFullYear()}  ${auxFecha.getHours()}:${auxFecha.getMinutes()}\n            Concepto: ${arrayMovimientos[i].concepto}\n`;
                }
            }
            textoMovimientos = `\nTotal targeta:      ${sumaTarjetas.toFixed(2)}\n` + textoMovimientos;
            permisosImpresora();
            const device = await dispositivos.getDevice();
            var options = { encoding: "ISO-8859-15" };
            var printer = new escpos.Printer(device, options);
            let mesInicial = fechaInicio.getMonth() + 1;
            let mesFinal = fechaFinal.getMonth() + 1;
            device.open(function () {
                printer
                    .font('a')
                    .style('b')
                    .align('CT')
                    .size(1, 1)
                    .text('BOTIGA : ' + nombreTienda)
                    .size(0, 0)
                    .text('Resum caixa')
                    .text('')
                    .align('LT')
                    .text('Resp.   : ' + nombreTrabajador)
                    .text(`Inici: ${fechaInicio.getDate()}-${mesInicial}-${fechaInicio.getFullYear()} ${(fechaInicio.getHours() < 10 ? '0' : '') + fechaInicio.getHours()}:${(fechaInicio.getMinutes() < 10 ? '0' : '') + fechaInicio.getMinutes()}`)
                    .text(`Final: ${fechaFinal.getDate()}-${mesFinal}-${fechaFinal.getFullYear()} ${(fechaFinal.getHours() < 10 ? '0' : '') + fechaFinal.getHours()}:${(fechaFinal.getMinutes() < 10 ? '0' : '') + fechaFinal.getMinutes()}`)
                    .text('')
                    .size(0, 1)
                    .text('Calaix fet       :      ' + calaixFet.toFixed(2))
                    .text('Descuadre        :      ' + descuadre.toFixed(2))
                    .text('Clients atesos   :      ' + nClientes)
                    .text('Recaudat         :      ' + recaudado.toFixed(2))
                    .text('Canvi inicial    :      ' + cInicioCaja.toFixed(2))
                    .text('Canvi final      :      ' + cFinalCaja.toFixed(2))
                    .text('')
                    .size(0, 0)
                    .text('Moviments de caixa')
                    .text('')
                    .text('')
                    .text(textoMovimientos)
                    .text('')
                    .cut()
                    .close();
            });
        }
        catch (err) {
            console.log(err);
        }
    }
    async abrirCajon() {
        const parametros = parametros_clase_1.parametrosInstance.getParametros();
        try {
            if (os.platform() === 'linux') {
                permisosImpresora();
                const device = await dispositivos.getDevice();
                var printer = new escpos.Printer(device);
                device.open(function () {
                    printer
                        .cashdraw(2)
                        .close();
                });
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    mostrarVisor(data) {
        console.log('El visor da muchos problemas');
    }
    async imprimirEntregas() {
        const params = parametros_clase_1.parametrosInstance.getParametros();
        return axios_1.default.post('entregas/getEntregas', { database: params.database, licencia: params.licencia }).then(async (res) => {
            try {
                permisosImpresora();
                const device = await dispositivos.getDevice();
                if (device != null) {
                    var options = { encoding: "ISO-8859-15" };
                    var printer = new escpos.Printer(device, options);
                    device.open(function () {
                        printer
                            .font('a')
                            .style('b')
                            .align('CT')
                            .size(0, 0)
                            .text(res.data.info)
                            .cut()
                            .close();
                    });
                    return { error: false, info: 'OK' };
                }
                return { error: true, info: 'Error, no se encuentra la impresora', };
            }
            catch (err) {
                console.log(err);
                return { error: true, info: 'Error en CATCH imprimirEntregas() 2', };
            }
        }).catch((err) => {
            console.log(err);
            return { error: true, info: 'Error en CATCH imprimirEntregas() 1', };
        });
    }
}
exports.Impresora = Impresora;
exports.impresoraInstance = new Impresora();
//# sourceMappingURL=impresora.class.js.map