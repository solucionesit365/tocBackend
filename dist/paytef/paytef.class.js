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
                            client.emit('consultaPaytef', { error: false, operacionCorrecta: true });
                        }
                        else {
                            client.emit('consultaPaytef', { error: true, mensaje: resCierreTicket.mensaje });
                        }
                        const resTransaccion = await transacciones_class_1.transaccionesInstance.crearTransaccion(cesta, total, idCliente);
                        if (resTransaccion.error === false) {
                            if (utiles_module_1.UtilesModule.checkVariable(resTransaccion.insertedId) && resTransaccion.insertedId !== '') {
                                const params = parametros_clase_1.parametrosInstance.getParametros();
                                if (utiles_module_1.UtilesModule.checkVariable(params.ipTefpay)) {
                                    const respuestaPaytef = await axios_1.default.post(`http://${params.ipTefpay}:8887/transaction/start`, {
                                        pinpad: "*",
                                        opType: "sale",
                                        createReceipt: true,
                                        executeOptions: {
                                            method: "polling"
                                        },
                                        language: "es",
                                        requestedAmount: Math.round(total * 100),
                                        requireConfirmation: false,
                                        transactionReference: resTransaccion.insertedId,
                                        showResultSeconds: 5
                                    });
                                    if (respuestaPaytef.data.info.started) {
                                        this.consultarEstadoOperacion(client);
                                    }
                                    else {
                                        client.emit('consultaPaytef', { error: true, mensaje: 'La operación no ha podido iniciar' });
                                    }
                                }
                                else {
                                    client.emit('consultaPaytef', { error: true, mensaje: 'IP TefPay no definida, contacta con informática' });
                                }
                            }
                        }
                        else {
                            client.emit('consultaPaytef', { error: true, mensaje: 'Error al crear la transacción' });
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
            const params = parametros_clase_1.parametrosInstance.getParametros();
            axios_1.default.post(`http://${params.ipTefpay}:8887/pinpad/cancel`, { "pinpad": "*" });
            console.log(err.message);
            client.emit('consultaPaytef', { error: true, mensaje: err.message });
            logs_class_1.LogsClass.newLog('iniciarTransaccion PayTefClass', err.message);
        }
    }
    async consultarEstadoOperacion(client) {
        try {
            const ipDatafono = parametros_clase_1.parametrosInstance.getParametros().ipTefpay;
            const ultimaTransaccion = await transacciones_class_1.transaccionesInstance.getUltimaTransaccion();
            const resEstadoPaytef = await axios_1.default.post(`http://${ipDatafono}:8887/transaction/poll`, { pinpad: "*" });
            if (utiles_module_1.UtilesModule.checkVariable(resEstadoPaytef.data.result)) {
                if (utiles_module_1.UtilesModule.checkVariable(resEstadoPaytef.data.result.transactionReference) && resEstadoPaytef.data.result.transactionReference != '') {
                    if (resEstadoPaytef.data.result.transactionReference === ultimaTransaccion._id.toString()) {
                        if (resEstadoPaytef.data.result.approved) {
                        }
                        else {
                            client.emit('consultaPaytef', { error: true, mensaje: 'Operación denegada' });
                        }
                    }
                    else {
                        await axios_1.default.post(`http://${ipDatafono}:8887/pinpad/cancel`, { "pinpad": "*" });
                        client.emit('consultaPaytef', { error: true, mensaje: 'La transacción no coincide con la actual de MongoDB' });
                    }
                }
                else {
                    if (resEstadoPaytef.data.result.approved && !resEstadoPaytef.data.result.failed) {
                        logs_class_1.LogsClass.newLog('PEOR ERROR POSIBLE', `no tengo referencia de la transacción: tiemstamp: ${Date.now()}`);
                    }
                    client.emit('consultaPaytef', { error: true, mensaje: 'Sin información de la última transacción => REINICIAR DATÁFONO' });
                }
            }
            else if (utiles_module_1.UtilesModule.checkVariable(resEstadoPaytef.data.info)) {
                if (resEstadoPaytef.data.info.transactionStatus === 'cancelling') {
                    client.emit('consultaPaytef', { error: true, mensaje: 'Operación cancelada' });
                }
                else {
                    await new Promise(r => setTimeout(r, 1000));
                    this.consultarEstadoOperacion(client);
                }
            }
            else {
                client.emit('consultaPaytef', { error: true, mensaje: 'Error, el datáfono no da respuesta' });
            }
        }
        catch (err) {
            console.log(err);
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
                    return { error: false };
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