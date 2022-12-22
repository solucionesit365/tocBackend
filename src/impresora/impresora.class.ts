import { articulosInstance } from "../articulos/articulos.clase";
import { ticketsInstance } from "../tickets/tickets.clase";
import { trabajadoresInstance } from "../trabajadores/trabajadores.clase";
import { TrabajadoresInterface } from "../trabajadores/trabajadores.interface";
import { clienteInstance } from "../clientes/clientes.clase";
import { parametrosInstance } from "../parametros/parametros.clase";
import { Dispositivos } from "../dispositivos";
import axios from "axios";
import { mqttInstance } from "../mqtt";
import { ClientesInterface } from "../clientes/clientes.interface";
import { ItemLista } from "../cestas/cestas.interface";
import { devolucionesInstance } from "../devoluciones/devoluciones.clase";
import { ObjectId } from "mongodb";
import { movimientosInstance } from "../movimientos/movimientos.clase";
import { MovimientosInterface } from "../movimientos/movimientos.interface";
import * as moment from "moment";
import { CajaSincro } from "../caja/caja.interface";
import { logger } from "src/logger";
moment.locale("es");
const dispositivos = new Dispositivos();
const escpos = require("escpos");
const exec = require("child_process").exec;
const os = require("os");
escpos.USB = require("escpos-usb");
escpos.Serial = require("escpos-serialport");
escpos.Screen = require("escpos-screen");
const TIPO_ENTRADA_DINERO = "ENTRADA";
const TIPO_SALIDA_DINERO = "SALIDA";

function permisosImpresora() {
  try {
    exec(`  echo sa | sudo -S chmod 777 -R /dev/bus/usb/
        echo sa | sudo -S chmod 777 -R /dev/ttyS0
        echo sa | sudo -S chmod 777 -R /dev/ttyS1
        echo sa | sudo -S chmod 777 -R /dev/    
    `);
  } catch (err) {
    mqttInstance.loggerMQTT(err.message);
  }
}

function random() {
  const numero = Math.floor(10000000 + Math.random() * 999999999);
  return numero.toString(16).slice(0, 8);
}

/* Función auxiliar borrar cuando sea posible */
function dateToString2(fecha) {
  let fechaFinal = null;
  if (typeof fecha === "string" || typeof fecha === "number") {
    fechaFinal = new Date(fecha);
  }

  const finalYear = `${fechaFinal.getFullYear()}`;
  let finalMonth = `${fechaFinal.getMonth() + 1}`;
  let finalDay = `${fechaFinal.getDate()}`;
  let finalHours = `${fechaFinal.getHours()}`;
  let finalMinutes = `${fechaFinal.getMinutes()}`;
  let finalSeconds = `${fechaFinal.getSeconds()}`;

  if (finalMonth.length === 1) {
    finalMonth = "0" + finalMonth;
  }
  if (finalDay.length === 1) {
    finalDay = "0" + finalDay;
  }
  if (finalHours.length === 1) {
    finalHours = "0" + finalHours;
  }
  if (finalMinutes.length === 1) {
    finalMinutes = "0" + finalMinutes;
  }
  if (finalSeconds.length === 1) {
    finalSeconds = "0" + finalSeconds;
  }
  return `${finalYear}-${finalMonth}-${finalDay} ${finalHours}:${finalMinutes}:${finalSeconds}`;
}

export class Impresora {
  /* Eze 4.0 */
  async bienvenidaCliente() {
    try {
      permisosImpresora();
      const device = await dispositivos.getDeviceVisor();

      if (device) mqttInstance.enviarVisor("Bon Dia!!");
      else throw Error("Controlado: dispositivo es null");
    } catch (err) {
      mqttInstance.loggerMQTT(err.message);
    }
  }

  /* Eze 4.0 */
  async despedirCliente() {
    try {
      permisosImpresora();
      const device = await dispositivos.getDeviceVisor();

      if (device)
        mqttInstance.enviarVisor("Moltes Gracies !!                       ");
      else throw Error("Controlado: dispositivo es null");
    } catch (err) {
      mqttInstance.loggerMQTT(err.message);
    }
  }

  /* Eze 4.0 */
  async imprimirTicket(idTicket: number) {
    const ticket = await ticketsInstance.getTicketById(idTicket);
    const parametros = await parametrosInstance.getParametros();
    const trabajador: TrabajadoresInterface =
      await trabajadoresInstance.getTrabajadorById(ticket.idTrabajador);

    let sendObject = null;

    if (ticket && trabajador) {
      if (ticket.idCliente && ticket.idCliente != "") {
        let infoCliente: ClientesInterface = null;
        infoCliente = await clienteInstance.getClienteById(ticket.idCliente);
        const puntos = await clienteInstance.getPuntosCliente(ticket.idCliente);

        sendObject = {
          numFactura: ticket._id,
          arrayCompra: ticket.cesta.lista,
          total: ticket.total,
          visa: await ticketsInstance.getFormaPago(ticket),
          tiposIva: ticket.cesta.detalleIva,
          cabecera: parametros.header,
          pie: parametros.footer,
          nombreTrabajador: trabajador.nombreCorto,
          impresora: parametros.tipoImpresora,
          infoClienteVip: null, // Mirar bien para terminar todo
          infoCliente: {
            nombre: infoCliente.nombre,
            puntos: puntos,
          },
        };
      } else {
        sendObject = {
          numFactura: ticket._id,
          arrayCompra: ticket.cesta.lista,
          total: ticket.total,
          visa: await ticketsInstance.getFormaPago(ticket),
          tiposIva: ticket.cesta.detalleIva,
          cabecera: parametros.header,
          pie: parametros.footer,
          nombreTrabajador: trabajador.nombreCorto,
          impresora: parametros.tipoImpresora,
          infoClienteVip: null, // Mirar bien para terminar todo
          infoCliente: null,
        };
      }
      await this._venta(sendObject);
    }
  }
  /* Eze 4.0 */
  async imprimirDevolucion(idDevolucion: ObjectId) {
    try {
      const devolucion = await devolucionesInstance.getDevolucionById(
        idDevolucion
      );
      const parametros = await parametrosInstance.getParametros();
      const trabajador: TrabajadoresInterface =
        await trabajadoresInstance.getTrabajadorById(devolucion.idTrabajador);
  
      let sendObject = null;
  
      if (devolucion && trabajador) {
        sendObject = {
          numFactura: devolucion._id,
          arrayCompra: devolucion.cesta.lista,
          total: devolucion.total,
          visa: null,
          tiposIva: devolucion.cesta.detalleIva,
          cabecera: parametros.header,
          pie: parametros.footer,
          nombreTrabajador: trabajador.nombreCorto,
          impresora: parametros.tipoImpresora,
          infoClienteVip: null, // Mirar bien para terminar todo
          infoCliente: null,
        };
  
        await this._venta(sendObject);
      }
    } catch (err) {
      logger.Error("imprimirDevolucion()", err);
    }
  }

  private async imprimirRecibo(recibo: string) {
    mqttInstance.loggerMQTT("imprimir recibo");
    try {
      permisosImpresora();
      const device = await dispositivos.getDevice();
      if (device == null) {
        throw "Error controlado: El dispositivo es null";
      }
      const printer = new escpos.Printer(device);

      device.open(function () {
        printer
          .setCharacterCodeTable(19)
          .encode("CP858")
          .font("a")
          .style("b")
          .size(0, 0)
          .text(recibo)
          .cut("PAPER_FULL_CUT")
          .close();
      });
    } catch (err) {
      mqttInstance.loggerMQTT("Error impresora: " + err);
    }
  }

  public async testMqtt(txt: string) {
    try {
      const device = new escpos.Screen();
      const printer = new escpos.Printer(device);

      device.open(function () {
        printer
          .setCharacterCodeTable(19)
          .encode("CP858")
          .font("a")
          .style("b")
          .size(0, 0)
          .text(txt)
          .cut("PAPER_FULL_CUT")
          .close();
      });
    } catch (err) {
      mqttInstance.loggerMQTT("Error impresora: " + err);
    }
  }

  private async _venta(info, recibo = null) {
    const numFactura = info.numFactura;
    const arrayCompra: ItemLista[] = info.arrayCompra;
    const total = info.total;
    const tipoPago = info.visa;
    //   mqttInstance.loggerMQTT(tipoPago)
    const tiposIva = info.tiposIva;
    const cabecera = info.cabecera;
    const pie = info.pie;
    const nombreDependienta = info.nombreTrabajador;
    const tipoImpresora = info.impresora;
    const infoClienteVip = info.infoClienteVip;
    const infoCliente = info.infoCliente;
    let strRecibo = "";
    if (recibo != null && recibo != undefined) {
      strRecibo = recibo;
    }

    permisosImpresora();
    const device = await dispositivos.getDevice();
    if (device) {
      const printer = new escpos.Printer(device);

      let detalles = "";
      let pagoTarjeta = "";
      let pagoTkrs = "";
      let detalleClienteVip = "";
      let detalleNombreCliente = "";
      let detallePuntosCliente = "";
      if (infoClienteVip && infoClienteVip.esVip) {
        detalleClienteVip = `Nom: ${infoClienteVip.nombre}\nNIF: ${infoClienteVip.nif}\nCP: ${infoClienteVip.cp}\nCiutat: ${infoClienteVip.ciudad}\nAdr: ${infoClienteVip.direccion}\n`;
      }

      if (infoCliente != null) {
        detalleNombreCliente = infoCliente.nombre;
        detallePuntosCliente = "PUNTOS: " + infoCliente.puntos;
      }

      for (let i = 0; i < arrayCompra.length; i++) {
        if (arrayCompra[i].promocion) {
          let nombrePrincipal = (
            await articulosInstance.getInfoArticulo(
              arrayCompra[i].promocion.idArticuloPrincipal
            )
          ).nombre;
          nombrePrincipal = "Oferta " + nombrePrincipal;
          while (nombrePrincipal.length < 20) {
            nombrePrincipal += " ";
          }
          detalles += `${
            arrayCompra[i].unidades *
            arrayCompra[i].promocion.cantidadArticuloPrincipal
          }     ${nombrePrincipal.slice(0, 20)}       ${arrayCompra[
            i
          ].promocion.precioRealArticuloPrincipal.toFixed(2)}\n`;
          if (arrayCompra[i].promocion.cantidadArticuloSecundario > 0) {
            let nombreSecundario = (
              await articulosInstance.getInfoArticulo(
                arrayCompra[i].promocion.idArticuloSecundario
              )
            ).nombre;
            nombreSecundario = "Oferta " + nombreSecundario;
            while (nombreSecundario.length < 20) {
              nombreSecundario += " ";
            }
            detalles += `${
              arrayCompra[i].unidades *
              arrayCompra[i].promocion.cantidadArticuloSecundario
            }     ${nombreSecundario.slice(0, 20)}       ${arrayCompra[
              i
            ].promocion.precioRealArticuloSecundario.toFixed(2)}\n`;
          }
        } else {
          if (arrayCompra[i].nombre.length < 20) {
            while (arrayCompra[i].nombre.length < 20) {
              arrayCompra[i].nombre += " ";
            }
          }
          detalles += `${arrayCompra[i].unidades}     ${arrayCompra[
            i
          ].nombre.slice(0, 20)}       ${arrayCompra[i].subtotal.toFixed(2)}\n`;
        }
      }
      const fecha = new Date();
      if (tipoPago == "TARJETA") {
        pagoTarjeta = "----------- PAGADO CON TARJETA ---------\n";
      }
      if (tipoPago == "TICKET_RESTAURANT") {
        pagoTkrs = "----- PAGADO CON TICKET RESTAURANT -----\n";
      }
      let pagoDevolucion: string = "";

      if (tipoPago == "DEVOLUCION") {
        //   mqttInstance.loggerMQTT('Entramos en tipo pago devolucion')
        pagoDevolucion = "-- ES DEVOLUCION --\n";
      }

      let detalleIva4 = "";
      let detalleIva10 = "";
      let detalleIva21 = "";
      let detalleIva = "";
      if (tiposIva.importe1 > 0) {
        detalleIva4 = `${tiposIva.base1.toFixed(
          2
        )}€      4%: ${tiposIva.valorIva1.toFixed(
          2
        )}€     ${tiposIva.importe1.toFixed(2)}€\n`;
      }
      if (tiposIva.importe2 > 0) {
        detalleIva10 = `${tiposIva.base2.toFixed(
          2
        )}€      10%: ${tiposIva.valorIva2.toFixed(
          2
        )}€     ${tiposIva.importe2.toFixed(2)}€\n`;
      }
      if (tiposIva.importe3 > 0) {
        detalleIva21 = `${tiposIva.base3.toFixed(
          2
        )}€     21%: ${tiposIva.valorIva3.toFixed(
          2
        )}€     ${tiposIva.importe3.toFixed(2)}€\n`;
      }
      detalleIva = detalleIva4 + detalleIva10 + detalleIva21;
      let infoConsumoPersonal = "";
      if (tipoPago == "CONSUMO_PERSONAL") {
        infoConsumoPersonal = "---------------- Dte. 100% --------------";
        detalleIva = "";
      }

      const diasSemana = [
        "Diumenge",
        "Dilluns",
        "Dimarts",
        "Dimecres",
        "Dijous",
        "Divendres",
        "Dissabte",
      ];

      device.open(function () {
        printer

          .setCharacterCodeTable(19)
          .encode("CP858")
          .font("a")
          .style("b")
          .size(0, 0)
          .text(cabecera)
          .text(
            `Data: ${diasSemana[fecha.getDay()]} ${fecha.getDate()}-${
              fecha.getMonth() + 1
            }-${fecha.getFullYear()}  ${
              (fecha.getHours() < 10 ? "0" : "") + fecha.getHours()
            }:${(fecha.getMinutes() < 10 ? "0" : "") + fecha.getMinutes()}`
          )
          .text("Factura simplificada N: " + numFactura)
          .text("Ates per: " + nombreDependienta)
          .text(detalleClienteVip)
          .text(detalleNombreCliente)
          .text(detallePuntosCliente)
          .control("LF")
          .control("LF")
          .control("LF")
          .text("Quantitat      Article        Import (EUR)")
          .text("-----------------------------------------")
          .align("LT")
          .text(detalles)
          .align("CT")
          .text(pagoTarjeta)
          .text(pagoTkrs)
          .align("LT")
          .text(infoConsumoPersonal)
          .size(1, 1)
          .text(pagoDevolucion)
          .text("TOTAL: " + total.toFixed(2) + " €")
          .control("LF")
          .size(0, 0)
          .align("CT")
          .text("Base IVA         IVA         IMPORT")
          .text(detalleIva)
          .text("-- ES COPIA --")
          .control("LF")
          .text("ID: " + random() + " - " + random())
          .text(pie)
          .control("LF")
          .control("LF")
          .control("LF")
          .cut("PAPER_FULL_CUT")
          .close();
      });
    } else throw Error("No se ha podido obtener el dispositivo");
  }

  /* Eze 4.0 */
  async imprimirSalida(movimiento: MovimientosInterface) {
    try {
      const parametros = await parametrosInstance.getParametros();
      const fechaStr = moment(movimiento._id).format("llll");
      const trabajador = await trabajadoresInstance.getTrabajadorById(
        movimiento.idTrabajador
      );
      permisosImpresora();
      const device = await dispositivos.getDevice();
      if (device) {
        const options = { encoding: "GB18030" };
        const printer = new escpos.Printer(device, options);
        device.open(function () {
          printer
            .setCharacterCodeTable(19)
            .encode("CP858")
            .font("a")
            .style("b")
            .align("CT")
            .size(0, 0)
            .text(parametros.nombreTienda)
            .text(fechaStr)
            .text("Dependienta: " + trabajador.nombre)
            .text("Retirada efectivo: " + movimiento.valor)
            .size(1, 1)
            .text(movimiento.valor)
            .size(0, 0)
            .text("Concepto")
            .size(1, 1)
            .text(movimiento.concepto)
            .text("")
            .barcode(movimiento.codigoBarras.slice(0, 12), "EAN13", 4)
            .text("")
            .text("")
            .text("")
            .cut()
            .close();
        });
      } else {
        throw Error("No se ha podido encontrar el dispositivo");
      }
    } catch (err) {
      logger.Error(146, err);
    }
  }

  /* Falta */
  async imprimirEntrada(
    totalIngresado: number,
    fecha: number,
    nombreDependienta: string
  ) {
    const parametros = await parametrosInstance.getParametros();
    try {
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

      const options = { encoding: "GB18030" };
      const printer = new escpos.Printer(device, options);
      device.open(function () {
        printer
          .setCharacterCodeTable(19)
          .encode("CP858")
          .font("a")
          .style("b")
          .align("CT")
          .size(0, 0)
          .text(parametros.nombreTienda)
          .text(fechaStr)
          .text("Dependienta: " + nombreDependienta)
          .text("Ingreso efectivo: " + totalIngresado)
          .size(1, 1)
          .text(totalIngresado)
          .size(0, 0)
          .text("")
          .size(1, 1)
          .text("")
          .text("")
          .text("")
          .cut()
          .close();
      });
    } catch (err) {
      mqttInstance.loggerMQTT(err);
    }
  }

  async imprimirTest() {
    const parametros = parametrosInstance.getParametros();
    try {
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

      const options = { encoding: "GB18030" };
      const printer = new escpos.Printer(device, options);
      device.open(function () {
        printer
          .setCharacterCodeTable(19)
          .encode("CP858")
          .font("a")
          .style("b")
          .align("CT")
          .size(1, 1)
          .text("HOLA HOLA")
          .cut()
          .close();
      });
    } catch (err) {
      mqttInstance.loggerMQTT(err);
    }
  }

  /* Eze 4.0 */
  async imprimirCaja(caja: CajaSincro) {
    const fechaInicio = new Date(caja.inicioTime);
    const fechaFinal = new Date(caja.finalTime);
    const arrayMovimientos = await movimientosInstance.getMovimientosIntervalo(
      caja.inicioTime,
      caja.finalTime
    );
    const parametros = await parametrosInstance.getParametros();
    const trabajadorApertura = await trabajadoresInstance.getTrabajadorById(
      caja.idDependientaApertura
    );
    const trabajadorCierre = await trabajadoresInstance.getTrabajadorById(
      caja.idDependientaCierre
    );
    let sumaTarjetas = 0;
    let textoMovimientos = "";

    for (let i = 0; i < arrayMovimientos.length; i++) {
      const auxFecha = new Date(arrayMovimientos[i]._id);
      switch (arrayMovimientos[i].tipo) {
        case "TARJETA":
          sumaTarjetas += arrayMovimientos[i].valor;
          break;
        case "TKRS_CON_EXCESO":
          break;
        case "TKRS_SIN_EXCESO":
          break;
        case "DEUDA":
          break;
        case "ENTREGA_DIARIA":
          textoMovimientos += `${
            i + 1
          }: Salida:\n           Cantidad: -${arrayMovimientos[i].valor.toFixed(
            2
          )}\n           Fecha: ${auxFecha.getDate()}/${auxFecha.getMonth()}/${auxFecha.getFullYear()}  ${auxFecha.getHours()}:${auxFecha.getMinutes()}\n           Concepto: ${
            arrayMovimientos[i].concepto
          }\n`;
          break;
        case "ENTRADA_DINERO":
          textoMovimientos += `${
            i + 1
          }: Entrada:\n            Cantidad: +${arrayMovimientos[
            i
          ].valor.toFixed(
            2
          )}\n            Fecha: ${auxFecha.getDate()}/${auxFecha.getMonth()}/${auxFecha.getFullYear()}  ${auxFecha.getHours()}:${auxFecha.getMinutes()}\n            Concepto: ${
            arrayMovimientos[i].concepto
          }\n`;
          break;
        case "DATAFONO_3G":
          sumaTarjetas += arrayMovimientos[i].valor;
          break;
      }
    }

    textoMovimientos =
      `\nTotal targeta:      ${sumaTarjetas.toFixed(2)}\n` + textoMovimientos;

    permisosImpresora();

    const device = await dispositivos.getDevice();
    if (device) {
      const options = { encoding: "ISO-8859-15" }; // "GB18030" };
      const printer = new escpos.Printer(device, options);
      const mesInicial = fechaInicio.getMonth() + 1;
      const mesFinal = fechaFinal.getMonth() + 1;
      device.open(function () {
        printer
          .setCharacterCodeTable(19)
          .encode("CP858")
          .font("a")
          .style("b")
          .align("CT")
          .size(1, 1)
          .text("BOTIGA : " + parametros.nombreTienda)
          .size(0, 0)
          .text("Resum caixa")
          .text("")
          .align("LT")
          .text("Resp. apertura   : " + trabajadorApertura.nombre)
          .text("Resp. cierre   : " + trabajadorCierre.nombre)
          .text(
            `Inici: ${fechaInicio.getDate()}-${mesInicial}-${fechaInicio.getFullYear()} ${
              (fechaInicio.getHours() < 10 ? "0" : "") + fechaInicio.getHours()
            }:${
              (fechaInicio.getMinutes() < 10 ? "0" : "") +
              fechaInicio.getMinutes()
            }`
          )
          .text(
            `Final: ${fechaFinal.getDate()}-${mesFinal}-${fechaFinal.getFullYear()} ${
              (fechaFinal.getHours() < 10 ? "0" : "") + fechaFinal.getHours()
            }:${
              (fechaFinal.getMinutes() < 10 ? "0" : "") +
              fechaFinal.getMinutes()
            }`
          )
          .text("")
          .size(0, 1)
          .text("Calaix fet       :      " + caja.calaixFetZ.toFixed(2))
          .text("Descuadre        :      " + caja.descuadre.toFixed(2))
          .text("Clients atesos   :      " + caja.nClientes)
          .text("Recaudat         :      " + caja.recaudado.toFixed(2))
          .text("Datafon 3g       :      " + caja.totalDatafono3G)
          .text("Canvi inicial    :      " + caja.totalApertura.toFixed(2))
          .text("Canvi final      :      " + caja.totalCierre.toFixed(2))
          .text("")
          .size(0, 0)
          .text("Moviments de caixa")
          .text("")
          .text("")
          .text(textoMovimientos)
          .text("")
          .text("")
          .text("")
          .text(
            "       0.01 --> " +
              caja.detalleApertura[0]["valor"].toFixed(2) +
              "      " +
              "0.01 --> " +
              caja.detalleCierre[0]["valor"].toFixed(2)
          )
          .text(
            "       0.02 --> " +
              caja.detalleApertura[1]["valor"].toFixed(2) +
              "      " +
              "0.02 --> " +
              caja.detalleCierre[1]["valor"].toFixed(2)
          )
          .text(
            "       0.05 --> " +
              caja.detalleApertura[2]["valor"].toFixed(2) +
              "      " +
              "0.05 --> " +
              caja.detalleCierre[2]["valor"].toFixed(2)
          )
          .text(
            "       0.10 --> " +
              caja.detalleApertura[3]["valor"].toFixed(2) +
              "      " +
              "0.10 --> " +
              caja.detalleCierre[3]["valor"].toFixed(2)
          )
          .text(
            "       0.20 --> " +
              caja.detalleApertura[4]["valor"].toFixed(2) +
              "      " +
              "0.20 --> " +
              caja.detalleCierre[4]["valor"].toFixed(2)
          )
          .text(
            "       0.50 --> " +
              caja.detalleApertura[5]["valor"].toFixed(2) +
              "      " +
              "0.50 --> " +
              caja.detalleCierre[5]["valor"].toFixed(2)
          )
          .text(
            "       1.00 --> " +
              caja.detalleApertura[6]["valor"].toFixed(2) +
              "      " +
              "1.00 --> " +
              caja.detalleCierre[6]["valor"].toFixed(2)
          )
          .text(
            "       2.00 --> " +
              caja.detalleApertura[7]["valor"].toFixed(2) +
              "      " +
              "2.00 --> " +
              caja.detalleCierre[7]["valor"].toFixed(2)
          )
          .text(
            "       5.00 --> " +
              caja.detalleApertura[8]["valor"].toFixed(2) +
              "      " +
              "5.00 --> " +
              caja.detalleCierre[8]["valor"].toFixed(2)
          )
          .text(
            "       10.00 --> " +
              caja.detalleApertura[9]["valor"].toFixed(2) +
              "     " +
              "10.00 --> " +
              caja.detalleCierre[9]["valor"].toFixed(2)
          )
          .text(
            "       20.00 --> " +
              caja.detalleApertura[10]["valor"].toFixed(2) +
              "    " +
              "20.00 --> " +
              caja.detalleCierre[10]["valor"].toFixed(2)
          )
          .text(
            "       50.00 --> " +
              caja.detalleApertura[11]["valor"].toFixed(2) +
              "    " +
              "50.00 --> " +
              caja.detalleCierre[11]["valor"].toFixed(2)
          )
          .text(
            "       100.00 --> " +
              caja.detalleApertura[12]["valor"].toFixed(2) +
              "   " +
              "100.00 --> " +
              caja.detalleCierre[12]["valor"].toFixed(2)
          )
          .text(
            "       200.00 --> " +
              caja.detalleApertura[13]["valor"].toFixed(2) +
              "   " +
              "200.00 --> " +
              caja.detalleCierre[13]["valor"].toFixed(2)
          )
          .text(
            "       500.00 --> " +
              caja.detalleApertura[14]["valor"].toFixed(2) +
              "   " +
              "500.00 --> " +
              caja.detalleCierre[14]["valor"].toFixed(2)
          )
          .text("")
          .text("")
          .text("")
          .cut()
          .close();
      });
    } else {
      throw Error("No se ha encontrado el dispositivo");
    }
  }
  /* Eze 4.0 */
  async imprimirCajaAsync(caja: CajaSincro) {
    try {
      const fechaInicio = new Date(caja.inicioTime);
      const fechaFinal = new Date(caja.finalTime);
      const arrayMovimientos =
        await movimientosInstance.getMovimientosIntervalo(
          caja.inicioTime,
          caja.finalTime
        );
      const parametros = await parametrosInstance.getParametros();
      const trabajadorApertura = await trabajadoresInstance.getTrabajadorById(
        caja.idDependientaApertura
      );
      const trabajadorCierre = await trabajadoresInstance.getTrabajadorById(
        caja.idDependientaCierre
      );
      let sumaTarjetas = 0;
      let textoMovimientos = "";

      for (let i = 0; i < arrayMovimientos.length; i++) {
        const auxFecha = new Date(arrayMovimientos[i]._id);
        switch (arrayMovimientos[i].tipo) {
          case "TARJETA":
            sumaTarjetas += arrayMovimientos[i].valor;
            break;
          case "TKRS_CON_EXCESO":
            break;
          case "TKRS_SIN_EXCESO":
            break;
          case "DEUDA":
            break;
          case "ENTREGA_DIARIA":
            textoMovimientos += `${
              i + 1
            }: Salida:\n           Cantidad: -${arrayMovimientos[
              i
            ].valor.toFixed(
              2
            )}\n           Fecha: ${auxFecha.getDate()}/${auxFecha.getMonth()}/${auxFecha.getFullYear()}  ${auxFecha.getHours()}:${auxFecha.getMinutes()}\n           Concepto: ${
              arrayMovimientos[i].concepto
            }\n`;
            break;
          case "ENTRADA_DINERO":
            textoMovimientos += `${
              i + 1
            }: Entrada:\n            Cantidad: +${arrayMovimientos[
              i
            ].valor.toFixed(
              2
            )}\n            Fecha: ${auxFecha.getDate()}/${auxFecha.getMonth()}/${auxFecha.getFullYear()}  ${auxFecha.getHours()}:${auxFecha.getMinutes()}\n            Concepto: ${
              arrayMovimientos[i].concepto
            }\n`;
            break;
          case "DATAFONO_3G":
            sumaTarjetas += arrayMovimientos[i].valor;
            break;
        }
      }

      textoMovimientos =
        `\nTotal targeta:      ${sumaTarjetas.toFixed(2)}\n` + textoMovimientos;

      permisosImpresora();

      const device = await dispositivos.getDevice();
      if (device) {
        const options = { encoding: "ISO-8859-15" }; // "GB18030" };
        const printer = new escpos.Printer(device, options);
        const mesInicial = fechaInicio.getMonth() + 1;
        const mesFinal = fechaFinal.getMonth() + 1;
        device.open(function () {
          printer
            .setCharacterCodeTable(19)
            .encode("CP858")
            .font("a")
            .style("b")
            .align("CT")
            .size(1, 1)
            .text("BOTIGA : " + parametros.nombreTienda)
            .size(0, 0)
            .text("Resum caixa")
            .text("")
            .align("LT")
            .text("Resp. apertura   : " + trabajadorApertura.nombre)
            .text("Resp. cierre   : " + trabajadorCierre.nombre)
            .text(
              `Inici: ${fechaInicio.getDate()}-${mesInicial}-${fechaInicio.getFullYear()} ${
                (fechaInicio.getHours() < 10 ? "0" : "") +
                fechaInicio.getHours()
              }:${
                (fechaInicio.getMinutes() < 10 ? "0" : "") +
                fechaInicio.getMinutes()
              }`
            )
            .text(
              `Final: ${fechaFinal.getDate()}-${mesFinal}-${fechaFinal.getFullYear()} ${
                (fechaFinal.getHours() < 10 ? "0" : "") + fechaFinal.getHours()
              }:${
                (fechaFinal.getMinutes() < 10 ? "0" : "") +
                fechaFinal.getMinutes()
              }`
            )
            .text("")
            .size(0, 1)
            .text("Calaix fet       :      " + caja.calaixFetZ.toFixed(2))
            .text("Descuadre        :      " + caja.descuadre.toFixed(2))
            .text("Clients atesos   :      " + caja.nClientes)
            .text("Recaudat         :      " + caja.recaudado.toFixed(2))
            .text("Datafon 3g       :      " + caja.totalDatafono3G)
            .text("Canvi inicial    :      " + caja.totalApertura.toFixed(2))
            .text("Canvi final      :      " + caja.totalCierre.toFixed(2))
            .text("")
            .size(0, 0)
            .text("Moviments de caixa")
            .text("")
            .text("")
            .text(textoMovimientos)
            .text("")
            .text("")
            .text("")
            .text(
              "       0.01 --> " +
                caja.detalleApertura[0]["valor"].toFixed(2) +
                "      " +
                "0.01 --> " +
                caja.detalleCierre[0]["valor"].toFixed(2)
            )
            .text(
              "       0.02 --> " +
                caja.detalleApertura[1]["valor"].toFixed(2) +
                "      " +
                "0.02 --> " +
                caja.detalleCierre[1]["valor"].toFixed(2)
            )
            .text(
              "       0.05 --> " +
                caja.detalleApertura[2]["valor"].toFixed(2) +
                "      " +
                "0.05 --> " +
                caja.detalleCierre[2]["valor"].toFixed(2)
            )
            .text(
              "       0.10 --> " +
                caja.detalleApertura[3]["valor"].toFixed(2) +
                "      " +
                "0.10 --> " +
                caja.detalleCierre[3]["valor"].toFixed(2)
            )
            .text(
              "       0.20 --> " +
                caja.detalleApertura[4]["valor"].toFixed(2) +
                "      " +
                "0.20 --> " +
                caja.detalleCierre[4]["valor"].toFixed(2)
            )
            .text(
              "       0.50 --> " +
                caja.detalleApertura[5]["valor"].toFixed(2) +
                "      " +
                "0.50 --> " +
                caja.detalleCierre[5]["valor"].toFixed(2)
            )
            .text(
              "       1.00 --> " +
                caja.detalleApertura[6]["valor"].toFixed(2) +
                "      " +
                "1.00 --> " +
                caja.detalleCierre[6]["valor"].toFixed(2)
            )
            .text(
              "       2.00 --> " +
                caja.detalleApertura[7]["valor"].toFixed(2) +
                "      " +
                "2.00 --> " +
                caja.detalleCierre[7]["valor"].toFixed(2)
            )
            .text(
              "       5.00 --> " +
                caja.detalleApertura[8]["valor"].toFixed(2) +
                "      " +
                "5.00 --> " +
                caja.detalleCierre[8]["valor"].toFixed(2)
            )
            .text(
              "       10.00 --> " +
                caja.detalleApertura[9]["valor"].toFixed(2) +
                "     " +
                "10.00 --> " +
                caja.detalleCierre[9]["valor"].toFixed(2)
            )
            .text(
              "       20.00 --> " +
                caja.detalleApertura[10]["valor"].toFixed(2) +
                "    " +
                "20.00 --> " +
                caja.detalleCierre[10]["valor"].toFixed(2)
            )
            .text(
              "       50.00 --> " +
                caja.detalleApertura[11]["valor"].toFixed(2) +
                "    " +
                "50.00 --> " +
                caja.detalleCierre[11]["valor"].toFixed(2)
            )
            .text(
              "       100.00 --> " +
                caja.detalleApertura[12]["valor"].toFixed(2) +
                "   " +
                "100.00 --> " +
                caja.detalleCierre[12]["valor"].toFixed(2)
            )
            .text(
              "       200.00 --> " +
                caja.detalleApertura[13]["valor"].toFixed(2) +
                "   " +
                "200.00 --> " +
                caja.detalleCierre[13]["valor"].toFixed(2)
            )
            .text(
              "       500.00 --> " +
                caja.detalleApertura[14]["valor"].toFixed(2) +
                "   " +
                "500.00 --> " +
                caja.detalleCierre[14]["valor"].toFixed(2)
            )
            .text("")
            .text("")
            .text("")
            .cut()
            .close();
        });
      } else {
        throw Error("No se ha encontrado el dispositivo");
      }
    } catch (err) {
      logger.Error(145, err);
    }
  }

  async abrirCajon() {
    const parametros = parametrosInstance.getParametros();
    try {
      if (os.platform() === "linux") {
        mqttInstance.loggerMQTT("abrir cajon linux");
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
        const printer = new escpos.Printer(device);

        device.open(function () {
          printer.cashdraw(2).close();
        });
      } else if (os.platform() === "win32") {
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
        const printer = new escpos.Printer(device);

        device.open(function () {
          printer.cashdraw(2).close();
        });
      }
    } catch (err) {
      mqttInstance.loggerMQTT(err);
    }
  }

  /* Eze 4.0 */
  async mostrarVisor(data) {
    let eur = "E";

    let limitNombre = 0;
    let lengthTotal = "";
    let datosExtra = "";
    if (data.total !== undefined) {
      lengthTotal = data.total.toString();
      if (lengthTotal.length == 1) limitNombre = 17;
      else if (lengthTotal.length == 2) limitNombre = 16;
      else if (lengthTotal.length == 3) limitNombre = 15;
      else if (lengthTotal.length == 4) limitNombre = 14;
      else if (lengthTotal.length == 5) limitNombre = 13;
      else if (lengthTotal.length == 6) limitNombre = 12;
      else if (lengthTotal.length == 7) limitNombre = 11;

      const dependienta = data.dependienta.substring(0, limitNombre);
      const total = data.total + eur;
      const espacio = " ";
      const size = 20 - (dependienta.length + total.length);
      const espacios = [
        "",
        " ",
        "  ",
        "   ",
        "    ",
        "     ",
        "      ",
        "       ",
        "        ",
        "         ",
        "          ",
        "           ",
        "            ",
        "             ",
        "              ",
      ];
      datosExtra = dependienta + espacios[size] + total;
    }
    if (datosExtra.length <= 2) {
      datosExtra = "";
      eur = "";
    }
    // Limito el texto a 14, ya que la línea completa tiene 20 espacios. (1-14 -> artículo, 15 -> espacio en blanco, 16-20 -> precio)
    data.texto = data.texto.substring(0, 14);
    data.texto += " " + data.precio + eur;
    let string = `${datosExtra} ${data.texto}                                               `;
    string = string + "                                             ";

    try {
      permisosImpresora();
      const device = await dispositivos.getDeviceVisor();
      if (device) mqttInstance.enviarVisor(string.substring(0, 40));
      else throw Error("Controlado: dispositivo es null");
    } catch (err) {
      mqttInstance.loggerMQTT("Error2: " + err);
    }
  }

  async imprimirEntregas() {
    const params = await parametrosInstance.getParametros();
    return axios
      .post("entregas/getEntregas", {
        database: params.database,
        licencia: params.licencia,
      })
      .then(async (res: any) => {
        try {
          permisosImpresora();
          const device = await dispositivos.getDevice();
          if (device != null) {
            const options = { encoding: "ISO-8859-15" }; // "GB18030" };
            const printer = new escpos.Printer(device, options);
            device.open(function () {
              printer
                .setCharacterCodeTable(19)
                .encode("CP858")
                .font("a")
                .style("b")
                .align("CT")
                .size(0, 0)
                .text(res.data.info)
                .cut()
                .close();
            });
            return { error: false, info: "OK" };
          }
          return { error: true, info: "Error, no se encuentra la impresora" };
        } catch (err) {
          mqttInstance.loggerMQTT(err);
          return { error: true, info: "Error en CATCH imprimirEntregas() 2" };
        }
      })
      .catch((err) => {
        mqttInstance.loggerMQTT(err);
        return { error: true, info: "Error en CATCH imprimirEntregas() 1" };
      });
  }
}
export const impresoraInstance = new Impresora();
