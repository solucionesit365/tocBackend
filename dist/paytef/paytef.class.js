"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paytefInstance = void 0;
const axios_1 = require("axios");
const movimientos_clase_1 = require("../movimientos/movimientos.clase");
const parametros_clase_1 = require("../parametros/parametros.clase");
const trabajadores_clase_1 = require("../trabajadores/trabajadores.clase");
const tickets_clase_1 = require("../tickets/tickets.clase");
const cestas_clase_1 = require("../cestas/cestas.clase");
const tickets_interface_1 = require("../tickets/tickets.interface");
const cestas_interface_1 = require("../cestas/cestas.interface");
const transacciones_class_1 = require("../transacciones/transacciones.class");
const tickets_mongodb_1 = require("../tickets/tickets.mongodb");
const utiles_module_1 = require("../utiles/utiles.module");
const logs_class_1 = require("../logs/logs.class");
const transacciones_interface_1 = require("../transacciones/transacciones.interface");
function limpiarNombreTienda(cadena) {
    const devolver = Number(cadena.replace(/\D/g, ''));
    if (isNaN(devolver) == false) {
        return devolver;
    }
    else {
        return 0;
    }
}
class PaytefClass {
    getTotal(cesta) {
        let total = 0;
        cesta.lista.forEach(itemLista => {
            total += itemLista.subtotal;
        });
        return total;
    }
    cancelarOperacion() {
        const params = parametros_clase_1.parametrosInstance.getParametros();
        axios_1.default.post(`http://${params.ipTefpay}:8887/pinpad/cancel`, { "pinpad": "*" });
    }
    iniciarDatafono(idTicket, total, client) {
        const params = parametros_clase_1.parametrosInstance.getParametros();
        if (utiles_module_1.UtilesModule.checkVariable(params.ipTefpay)) {
            axios_1.default.post(`http://${params.ipTefpay}:8887/transaction/start`, {
                pinpad: "*",
                opType: "sale",
                createReceipt: true,
                executeOptions: {
                    method: "polling"
                },
                language: "es",
                requestedAmount: Math.round(total * 100),
                requireConfirmation: false,
                transactionReference: idTicket,
                showResultSeconds: 5
            }).then((respuestaPaytef) => {
                if (respuestaPaytef.data.info.started) {
                    this.consultarEstadoOperacion(client, idTicket);
                }
                else {
                    client.emit('consultaPaytef', { error: true, mensaje: 'La operación no ha podido iniciar' });
                }
            }).catch((err) => {
                client.emit('consultaPaytef', { error: true, mensaje: 'Backend: ' + err.message });
            });
        }
        else {
            client.emit('consultaPaytef', { error: true, mensaje: 'IP TefPay no definida, contacta con informática' });
        }
    }
    async iniciarTransaccion(client, idCliente, idCesta) {
        try {
            const idTrabajadorActivo = await trabajadores_clase_1.trabajadoresInstance.getCurrentIdTrabajador();
            if (idTrabajadorActivo != null) {
                const cesta = await cestas_clase_1.cestas.getCestaByID(idCesta);
                if (cesta != null) {
                    const total = this.getTotal(cesta);
                    if (cesta.lista.length > 0 && total > 0) {
                        const nuevoTicket = tickets_clase_1.ticketsInstance.generarObjetoTicket((await tickets_clase_1.ticketsInstance.getUltimoTicket()) + 1, total, cesta, "TARJETA", idTrabajadorActivo, idCliente);
                        const resCierreTicket = await paytefInstance.cerrarTicket(nuevoTicket);
                        if (resCierreTicket.error === false) {
                            this.iniciarDatafono(resCierreTicket.info, total, client);
                        }
                        else {
                            client.emit('consultaPaytef', { error: true, mensaje: resCierreTicket.mensaje });
                        }
                    }
                    else {
                        client.emit('consultaPaytef', { error: true, mensaje: 'Lista vacía o total a 0€' });
                    }
                }
                else {
                    client.emit('consultaPaytef', { error: true, mensaje: 'No existe la cesta del trabajador activo' });
                }
            }
            else {
                client.emit('consultaPaytef', { error: true, mensaje: 'No existe el trabajador activo' });
            }
        }
        catch (err) {
            this.cancelarOperacion();
            console.log(err.message);
            client.emit('consultaPaytef', { error: true, mensaje: err.message });
        }
    }
    anularOperacion(idTicket, client) {
        tickets_clase_1.ticketsInstance.anularTicket(idTicket).then((resAnulacion) => {
            if (resAnulacion) {
                client.emit('consultaPaytef', { error: true, mensaje: 'Operación denegada. Ticket anulado' });
            }
            else {
                logs_class_1.LogsClass.newLog('Error nuevo grave', `Ticket denegado por PayTef pero no anulado por el toc: idTicket: ${idTicket} tiemstamp: ${Date.now()}`);
                client.emit('consultaPaytef', { error: true, mensaje: 'CONTACTA A INFORMÁTICA. Ticket denegado por PayTef pero no anulado por el toc' });
            }
        });
    }
    async consultarEstadoOperacion(client, idTicket) {
        try {
            const ipDatafono = parametros_clase_1.parametrosInstance.getParametros().ipTefpay;
            const resEstadoPaytef = await axios_1.default.post(`http://${ipDatafono}:8887/transaction/poll`, { pinpad: "*" });
            if (utiles_module_1.UtilesModule.checkVariable(resEstadoPaytef.data.result)) {
                if (Number(resEstadoPaytef.data.result.transactionReference) === idTicket) {
                    if (resEstadoPaytef.data.result.approved) {
                        client.emit('consultaPaytef', { error: false, operacionCorrecta: true });
                    }
                    else {
                        this.anularOperacion(idTicket, client);
                    }
                }
                else if (resEstadoPaytef.data.result.approved) {
                    logs_class_1.LogsClass.newLog('Error nuevo (sin referencia)', `Ticket aprobado por PayTef y creado en el toc, pero sin referencia: ${idTicket} timestamp: ${Date.now()}`);
                    client.emit('consultaPaytef', { error: false, operacionCorrecta: true });
                }
                else {
                    this.anularOperacion(idTicket, client);
                }
            }
            else if (utiles_module_1.UtilesModule.checkVariable(resEstadoPaytef.data.info)) {
                if (resEstadoPaytef.data.info.transactionStatus === 'cancelling') {
                    client.emit('consultaPaytef', { error: true, mensaje: 'Operación cancelada' });
                }
                else {
                    await new Promise(r => setTimeout(r, 1000));
                    this.consultarEstadoOperacion(client, idTicket);
                }
            }
            else {
                await new Promise(r => setTimeout(r, 1000));
                this.consultarEstadoOperacion(client, idTicket);
            }
        }
        catch (err) {
            const ipDatafono = parametros_clase_1.parametrosInstance.getParametros().ipTefpay;
            axios_1.default.post(`http://${ipDatafono}:8887/pinpad/cancel`, { "pinpad": "*" });
            logs_class_1.LogsClass.newLog('Error backend paytefClass consultarEstadoOperacion', err.message);
            client.emit('consultaPaytef', { error: true, mensaje: 'Error ' + err.message });
        }
    }
    async cerrarTicket(nuevoTicket) {
        if (await tickets_clase_1.ticketsInstance.insertarTicket(nuevoTicket)) {
            if (await cestas_clase_1.cestas.borrarCestaActiva()) {
                movimientos_clase_1.movimientosInstance.nuevaSalida(nuevoTicket.total, 'Targeta', 'TARJETA', false, nuevoTicket._id);
                if (await parametros_clase_1.parametrosInstance.setUltimoTicket(nuevoTicket._id)) {
                    return { error: false, info: nuevoTicket._id };
                }
                else {
                    return { error: true, mensaje: 'Error no se ha podido cambiar el último id ticket' };
                }
            }
            else {
                return { error: true, mensaje: 'Error, no se ha podido borrar la cesta' };
            }
        }
    }
}
const paytefInstance = new PaytefClass();
exports.paytefInstance = paytefInstance;
//# sourceMappingURL=paytef.class.js.map