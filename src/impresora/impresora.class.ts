import { articulosInstance } from "../articulos/articulos.clase";
import { paramsTicketInstance } from "../params-ticket/params-ticket.class";
import { ticketsInstance } from "../tickets/tickets.clase";
import { TicketsInterface } from "../tickets/tickets.interface";
import { trabajadoresInstance } from "../trabajadores/trabajadores.clase";
import { TrabajadoresInterface } from "../trabajadores/trabajadores.interface";
import { clienteInstance } from "../clientes/clientes.clase";
import { parametrosInstance } from "../parametros/parametros.clase";
import { Dispositivos } from "../dispositivos";
import { devolucionesInstance } from "src/devoluciones/devoluciones.clase";
import axios from "axios";


const dispositivos = new Dispositivos();
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
    } catch(err) {
        console.log(err);
    }
}

/* Función auxiliar */
function dateToString2(fecha) {
    var fechaFinal = null;
    if(typeof fecha === 'string' || typeof fecha === 'number')
    {
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

export class Impresora {
    async imprimirTicket(idTicket: number, esDevolucion = false) {
        const paramsTicket = await paramsTicketInstance.getParamsTicket();
        //const infoTicket: TicketsInterface = await ticketsInstance.getTicketByID(idTicket);
        let infoTicket;
        if(!esDevolucion) {
            infoTicket = await ticketsInstance.getTicketByID(idTicket);
        } else {
            infoTicket = await devolucionesInstance.getDevolucionByID(idTicket);
        }
        // console.log(infoTicket)
        const infoTrabajador: TrabajadoresInterface = await trabajadoresInstance.getTrabajador(infoTicket.idTrabajador);
        const parametros = parametrosInstance.getParametros();
        var sendObject;

        if (infoTicket != null) {
            if(infoTicket.cliente != null && infoTicket.tipoPago != 'DEUDA' && infoTicket.cliente != undefined) {
                const infoClienteAux = await clienteInstance.getClienteByID(infoTicket.cliente);
                const infoCliente = infoClienteAux;
                var auxNombre = '';
                var puntosCliente = 0;
                if(infoCliente != null) {
                    auxNombre = infoCliente.nombre;
                    puntosCliente = await clienteInstance.getPuntosCliente(infoTicket.cliente);
                } else {
                    auxNombre = '';
                }
                
                sendObject = {
                    numFactura: infoTicket._id,
                    arrayCompra: infoTicket.lista,
                    total: infoTicket.total,
                    visa: infoTicket.tipoPago,
                    tiposIva: infoTicket.tiposIva,
                    cabecera: paramsTicket[0] !== undefined ? paramsTicket[0].valorDato: '',
                    pie: paramsTicket[1] !== undefined ? paramsTicket[1].valorDato: '',
                    nombreTrabajador: (infoTrabajador.nombreCorto != null) ? (infoTrabajador.nombreCorto): (''),
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
                    cabecera: paramsTicket[0] !== undefined ? paramsTicket[0].valorDato: '',
                    pie: paramsTicket[1] !== undefined ? paramsTicket[1].valorDato: '',
                    nombreTrabajador: (infoTrabajador.nombreCorto != null) ? (infoTrabajador.nombreCorto): (''),
                    impresora: parametros.tipoImpresora,
                    infoClienteVip: infoTicket.infoClienteVip,
                    infoCliente: null
                };
    
                this._venta(sendObject);
            }
        }

    }

    private async _venta(info) {
        const numFactura = info.numFactura;
        const arrayCompra = info.arrayCompra;
        const total = info.total;
        const tipoPago = info.visa;
        // console.log(tipoPago)
        const tiposIva = info.tiposIva;
        const cabecera = info.cabecera;
        const pie = info.pie;
        const nombreDependienta = info.nombreTrabajador;
        const tipoImpresora = info.impresora;
        const infoClienteVip = info.infoClienteVip;
        const infoCliente = info.infoCliente;

        try {
            permisosImpresora();

            // if(tipoImpresora === 'USB')
            // {
            //     const arrayDevices = escpos.USB.findPrinter();
            //     if (arrayDevices.length > 0) {
            //         /* Solo puede haber un dispositivo USB */
            //         const dispositivoUnico = arrayDevices[0];
            //         var device = new escpos.USB(dispositivoUnico); //USB
            //     } else if (arrayDevices.length == 0) {
            //         throw 'Error, no hay ningún dispositivo USB conectado';
            //     } else {
            //         throw 'Error, hay más de un dispositivo USB conectado';
            //     }
            // }
            // else
            // {
            //     if(tipoImpresora === 'SERIE')
            //     {
            //         var device = new escpos.Serial('/dev/ttyS0', {
            //             baudRate: 115200,
            //             stopBit: 2
            //         });
            //     }
            // }
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
            if(infoClienteVip && infoClienteVip.esVip)
            {
                detalleClienteVip = `Nom: ${infoClienteVip.nombre}\nNIF: ${infoClienteVip.nif}\nCP: ${infoClienteVip.cp}\nCiutat: ${infoClienteVip.ciudad}\nAdr: ${infoClienteVip.direccion}\n`;
            }
    
            if(infoCliente != null) {
                detalleNombreCliente = infoCliente.nombre;
                detallePuntosCliente = 'PUNTOS: ' + infoCliente.puntos;
            }
    
            for (let i = 0; i < arrayCompra.length; i++) 
            {
                if(arrayCompra[i].promocion.esPromo)
                {
                    let nombrePrincipal = (await articulosInstance.getInfoArticulo(arrayCompra[i].promocion.infoPromo.idPrincipal)).nombre;
                    nombrePrincipal = "Oferta " + nombrePrincipal;
                    while (nombrePrincipal.length < 20) 
                    {
                        nombrePrincipal += ' ';
                    }
                    detalles += `${arrayCompra[i].unidades*arrayCompra[i].promocion.infoPromo.cantidadPrincipal}     ${nombrePrincipal.slice(0, 20)}       ${arrayCompra[i].promocion.infoPromo.precioRealPrincipal.toFixed(2)}\n`;
                    if(arrayCompra[i].promocion.infoPromo.cantidadSecundario > 0)
                    {
                        let nombreSecundario = (await articulosInstance.getInfoArticulo(arrayCompra[i].promocion.infoPromo.idSecundario)).nombre;
                        nombreSecundario = "Oferta " + nombreSecundario;
                        while (nombreSecundario.length < 20) 
                        {
                            nombreSecundario += ' ';
                        }
                        detalles += `${arrayCompra[i].unidades*arrayCompra[i].promocion.infoPromo.cantidadSecundario}     ${nombreSecundario.slice(0, 20)}       ${arrayCompra[i].promocion.infoPromo.precioRealSecundario.toFixed(2)}\n`;
                    }
                }
                else
                {
                    if (arrayCompra[i].nombre.length < 20) 
                    {
                        while (arrayCompra[i].nombre.length < 20) 
                        {
                            arrayCompra[i].nombre += ' ';
                        }
                    }
                    detalles += `${arrayCompra[i].unidades}     ${arrayCompra[i].nombre.slice(0, 20)}       ${arrayCompra[i].subtotal.toFixed(2)}\n`;
                }
                
            }
            var fecha = new Date();
            if (tipoPago == "TARJETA") 
            {
                pagoTarjeta = '----------- PAGADO CON TARJETA ---------\n';
            }
            if (tipoPago == "TICKET_RESTAURANT") 
            {
                pagoTkrs    = '----- PAGADO CON TICKET RESTAURANT -----\n';
            }
            var pagoDevolucion: string = '';
    
            if(tipoPago == "DEVOLUCION")
            {
                // console.log('Entramos en tipo pago devolucion')
                pagoDevolucion = '-- ES DEVOLUCION --\n';
            }
    
    
    
            var detalleIva4 = '';
            var detalleIva10 = '';
            var detalleIva21 = '';
            var detalleIva = '';
            if (tiposIva.importe1 > 0) 
            {
                detalleIva4 = `${tiposIva.base1.toFixed(2)}        4%: ${tiposIva.valorIva1.toFixed(2)}      ${tiposIva.importe1.toFixed(2)}\n`;
            }
            if (tiposIva.importe2 > 0) 
            {
                detalleIva10 = `${tiposIva.base2.toFixed(2)}        10%: ${tiposIva.valorIva2.toFixed(2)}      ${tiposIva.importe2.toFixed(2)}\n`;
            }
            if (tiposIva.importe3 > 0) 
            {
                detalleIva21 = `${tiposIva.base3.toFixed(2)}       21%: ${tiposIva.valorIva3.toFixed(2)}      ${tiposIva.importe3.toFixed(2)}\n`;
            }
            detalleIva = detalleIva4 + detalleIva10 + detalleIva21;
            var infoConsumoPersonal = '';
            if(tipoPago == "CONSUMO_PERSONAL")
            {
                infoConsumoPersonal = '---------------- Dte. 100% --------------';
                detalleIva = '';
            }
    
            device.open(function () 
            {
                printer
                    .encode('latin1')
                    .font('a')
                    .style('b')
                    .size(0, 0)
                    .text(cabecera)
                    .text(`Data: ${fecha.getDate()}-${fecha.getMonth() + 1}-${fecha.getFullYear()}  ${(fecha.getHours()<10?'0':'') + fecha.getHours()}:${(fecha.getMinutes()<10?'0':'') + fecha.getMinutes()}`)
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
                    .close()
            });
        }
        catch (err) {
            console.log("Error impresora: ", err);
        }
    }

    async imprimirSalida(cantidad: number, fecha: number, nombreTrabajador: string, nombreTienda: string, concepto: string, tipoImpresora: string, codigoBarras: string) {
        try {
            const fechaStr = dateToString2(fecha);
            permisosImpresora();

            // if(tipoImpresora === 'USB')
            // {
            //     const arrayDevices = escpos.USB.findPrinter();
            //     if (arrayDevices.length > 0) {
            //         /* Solo puede haber un dispositivo USB */
            //         const dispositivoUnico = arrayDevices[0];
            //         var device = new escpos.USB(dispositivoUnico); //USB
            //     } else if (arrayDevices.length == 0) {
            //         throw 'Error, no hay ningún dispositivo USB conectado';
            //     } else {
            //         throw 'Error, hay más de un dispositivo USB conectado';
            //     }
            // }
            // else if(tipoImpresora === 'SERIE') {
            //     var device = new escpos.Serial('/dev/ttyS0', {
            //         baudRate: 115000,
            //         stopBit: 2
            //     });
            // }
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
                    .close()
            });
        }
        catch (err) {
            console.log(err);
        }
    }

    async imprimirEntrada(totalIngresado: number, fecha: number, nombreDependienta: string) {
        const parametros = parametrosInstance.getParametros();
        try  {
            const fechaStr = dateToString2(fecha);
            permisosImpresora();
            // if(parametros.tipoImpresora === 'USB')
            // {
            //     const arrayDevices = escpos.USB.findPrinter();
            //     if (arrayDevices.length > 0) {
            //         /* Solo puede haber un dispositivo USB */
            //         const dispositivoUnico = arrayDevices[0];
            //         var device = new escpos.USB(dispositivoUnico); //USB
            //     } else if (arrayDevices.length == 0) {
            //         throw 'Error, no hay ningún dispositivo USB conectado';
            //     } else {
            //         throw 'Error, hay más de un dispositivo USB conectado';
            //     }
            // }
            // else if(parametros.tipoImpresora === 'SERIE') {
            //     var device = new escpos.Serial('/dev/ttyS0', {
            //         baudRate: 115000,
            //         stopBit: 2
            //     });
            // }
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
                    .close()
            });
        }
        catch (err) {
            console.log(err);
        }
    }

    async imprimirTest() {
        const parametros = parametrosInstance.getParametros();
        try  {
            permisosImpresora();
            // if(parametros.tipoImpresora === 'USB')
            // {
            //     const arrayDevices = escpos.USB.findPrinter();
            //     if (arrayDevices.length > 0) {
            //         /* Solo puede haber un dispositivo USB */
            //         const dispositivoUnico = arrayDevices[0];
            //         var device = new escpos.USB(dispositivoUnico); //USB
            //     } else if (arrayDevices.length == 0) {
            //         throw 'Error, no hay ningún dispositivo USB conectado';
            //     } else {
            //         throw 'Error, hay más de un dispositivo USB conectado';
            //     }
            // }
            // else if(parametros.tipoImpresora === 'SERIE') {
            //     var device = new escpos.Serial('/dev/ttyS0', {
            //         baudRate: 115000,
            //         stopBit: 2
            //     });
            // }
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
                    .close()
            });
        }
        catch (err) {
            console.log(err);
        }
    }

    async imprimirCaja(calaixFet, nombreTrabajador, descuadre, nClientes, recaudado, arrayMovimientos: any[], nombreTienda, fI, fF, cInicioCaja, cFinalCaja, tipoImpresora) {
        try {
            var fechaInicio = new Date(fI);
            var fechaFinal = new Date(fF);
            var sumaTarjetas = 0;
            var textoMovimientos = '';
            for (let i = 0; i < arrayMovimientos.length; i++) {
                var auxFecha = new Date(arrayMovimientos[i]._id);
                if (arrayMovimientos[i].tipo === TIPO_SALIDA_DINERO) {
                    if(arrayMovimientos[i].concepto == 'Targeta' || arrayMovimientos[i].concepto == 'Targeta 3G') {
                        sumaTarjetas += arrayMovimientos[i].valor;
                    } else {
                        textoMovimientos += `${i + 1}: Salida:\n           Cantidad: -${arrayMovimientos[i].valor.toFixed(2)}\n           Fecha: ${auxFecha.getDate()}/${auxFecha.getMonth()}/${auxFecha.getFullYear()}  ${auxFecha.getHours()}:${auxFecha.getMinutes()}\n           Concepto: ${arrayMovimientos[i].concepto}\n`;
                    }
                }
                if (arrayMovimientos[i].tipo === TIPO_ENTRADA_DINERO) {
                    textoMovimientos += `${i + 1}: Entrada:\n            Cantidad: +${arrayMovimientos[i].valor.toFixed(2)}\n            Fecha: ${auxFecha.getDate()}/${auxFecha.getMonth()}/${auxFecha.getFullYear()}  ${auxFecha.getHours()}:${auxFecha.getMinutes()}\n            Concepto: ${arrayMovimientos[i].concepto}\n`;
                }
            }
            textoMovimientos = `\nTotal targeta:      ${sumaTarjetas.toFixed(2)}\n` + textoMovimientos;
    
            permisosImpresora();
            // if(tipoImpresora === 'USB')
            // {
            //     const arrayDevices = escpos.USB.findPrinter();
            //     if (arrayDevices.length > 0) {
            //         /* Solo puede haber un dispositivo USB */
            //         const dispositivoUnico = arrayDevices[0];
            //         var device = new escpos.USB(dispositivoUnico); //USB
            //     } else if (arrayDevices.length == 0) {
            //         throw 'Error, no hay ningún dispositivo USB conectado';
            //     } else {
            //         throw 'Error, hay más de un dispositivo USB conectado';
            //     }
            // }
            // else {
            //     if(tipoImpresora === 'SERIE')
            //     {
            //         var device = new escpos.Serial('/dev/ttyS0', {
            //             baudRate: 115000,
            //             stopBit: 2
            //           })
            //     }
            // }
            const device = await dispositivos.getDevice();
            var options = { encoding: "ISO-8859-15" }; //"GB18030" };
            var printer = new escpos.Printer(device, options);
            let mesInicial = fechaInicio.getMonth()+1;
            let mesFinal = fechaFinal.getMonth()+1;
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
                    .text(`Inici: ${fechaInicio.getDate()}-${mesInicial}-${fechaInicio.getFullYear()} ${(fechaInicio.getHours()<10?'0':'') + fechaInicio.getHours()}:${(fechaInicio.getMinutes()<10?'0':'') + fechaInicio.getMinutes()}`)
                    .text(`Final: ${fechaFinal.getDate()}-${mesFinal}-${fechaFinal.getFullYear()} ${(fechaFinal.getHours()<10?'0':'') + fechaFinal.getHours()}:${(fechaFinal.getMinutes()<10?'0':'') + fechaFinal.getMinutes()}`)
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
                    .close()
    
            });
        }
        catch (err) {
            console.log(err);
        } 
    }

    async abrirCajon() {
        const parametros = parametrosInstance.getParametros();
        try {
            if(os.platform() === 'linux') {
                permisosImpresora();
                // if(parametros.tipoImpresora === 'USB')
                // {
                //     const arrayDevices = escpos.USB.findPrinter();
                //     if (arrayDevices.length > 0) {
                //         /* Solo puede haber un dispositivo USB */
                //         const dispositivoUnico = arrayDevices[0];
                //         var device = new escpos.USB(dispositivoUnico); //USB
                //     } else if (arrayDevices.length == 0) {
                //         throw 'Error, no hay ningún dispositivo USB conectado';
                //     } else {
                //         throw 'Error, hay más de un dispositivo USB conectado';
                //     }
                // } else {
                //     if(parametros.tipoImpresora === 'SERIE') {
                //         var device = new escpos.Serial('/dev/ttyS0', {
                //             baudRate: 115000,
                //             stopBit: 2
                //           });
                //     }
                // }
                const device = await dispositivos.getDevice();
                var printer = new escpos.Printer(device);
        
                device.open(function () {
                    printer
                        .cashdraw(2)
                        .close()
                });
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    mostrarVisor(data) {
        // var eur = String.fromCharCode(128);
        
        // var limitNombre = 0;
        // var lengthTotal = '';
        // var datosExtra = '';
        // if(data.total !== undefined) {
        //     lengthTotal = (data.total).toString();
        //     if(lengthTotal.length == 1) limitNombre = 17;
        //     else if(lengthTotal.length == 2) limitNombre = 16;
        //     else if(lengthTotal.length == 3) limitNombre = 15;
        //     else if(lengthTotal.length == 4) limitNombre = 14;
        //     else if(lengthTotal.length == 5) limitNombre = 13;
        //     else if(lengthTotal.length == 6) limitNombre = 12;
        //     else if(lengthTotal.length == 7) limitNombre = 11;
        //     datosExtra = data.dependienta.substring(0, limitNombre) + " " + data.total + eur; 
        // }
        // if(datosExtra.length <= 2) {
        //     datosExtra = ""; 
        //     eur = "";
        // }
        // // Limito el texto a 14, ya que la línea completa tiene 20 espacios. (1-14 -> artículo, 15 -> espacio en blanco, 16-20 -> precio)
        // data.texto = datosExtra + "" + data.texto.substring(0, 14);
        // data.texto += " " + data.precio + eur;
        // try {
        //     permisosImpresora();
        //     //   var device = new escpos.USB('0x67b','0x2303');
        //     const device = dispositivos.getDeviceVisor();
            
        //     if (device != null) {
        //         var options = { encoding: "ISO-8859-1" };
        //         var printer = new escpos.Screen(device, options);
                
        //         device.open(function () {
        //             printer
        //                 // Espacios en blanco para limpiar el visor y volver a mostrar los datos en el sitio correcto
        //                 //.text(stringVacia)
        //                 .clear()
        //                 //.moveUp()
        //                 // Información del artículo (artículo + precio)
        //                 .text(data.texto)
        //                 //.moveDown()
        //                 //.text(datosExtra)
        //                 //.text(datosExtra)
        //                 .close()
        //         });
        //     } else {
        //         console.log("Controlado: dispositivo es null");
        //     }
        // } catch (err) {
        //     console.log("Error: ", err)
        //     //errorImpresora(err, event);
        // }
        console.log('El visor da muchos problemas');
    }
    async imprimirEntregas() {
        const params = parametrosInstance.getParametros();
        return axios.post('entregas/getEntregas', { database: params.database, licencia: params.licencia }).then(async (res: any) => {
            try {
                permisosImpresora();
                const device = await dispositivos.getDevice();
                if (device != null) {
                    var options = { encoding: "ISO-8859-15" }; //"GB18030" };
                    var printer = new escpos.Printer(device, options);
                    device.open(function () {
                        printer
                            .font('a')
                            .style('b')
                            .align('CT')
                            .size(0, 0)
                            .text(res.data.info)
                            .cut()
                            .close()
                    });
                    return { error: false, info: 'OK' };
                }
                return { error: true, info: 'Error, no se encuentra la impresora', }
            }
            catch (err) {
                console.log(err);
                return { error: true, info: 'Error en CATCH imprimirEntregas() 2', }
            }
        }).catch((err) => {
            console.log(err);
            return { error: true, info: 'Error en CATCH imprimirEntregas() 1', }
        });
    }
}
export const impresoraInstance = new Impresora();