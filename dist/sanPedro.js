"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitSocket = exports.socket = void 0;
const tickets_clase_1 = require("./tickets/tickets.clase");
const sincro_1 = require("./sincro");
const caja_clase_1 = require("./caja/caja.clase");
const movimientos_clase_1 = require("./movimientos/movimientos.clase");
const trabajadores_clase_1 = require("./trabajadores/trabajadores.clase");
const devoluciones_clase_1 = require("./devoluciones/devoluciones.clase");
const io = require("socket.io-client");
const socket = io('http://34.78.247.153:3001');
exports.socket = socket;
function emitSocket(canal, datos = null) {
    if (socket.connected) {
        socket.emit(canal, datos);
    }
}
exports.emitSocket = emitSocket;
socket.on('resSincroTickets', async (data) => {
    if (data.error == false) {
        if (data.arrayTickets.length > 0) {
            if (await tickets_clase_1.ticketsInstance.actualizarEstadoTicket(data.arrayTickets[0])) {
                (0, sincro_1.sincronizarTickets)();
            }
            else {
                console.log("Error al actualizar el ticket");
            }
        }
        else {
            console.log('Nada que insertar');
        }
    }
    else {
        if (typeof data.arrayTickets[0].comentario == 'string') {
            if (data.mensaje == 'SanPedro: Error, parámetros incorrectos') {
                data.arrayTickets[0].comentario = 'SanPedro: Error, parámetros incorrectos';
            }
            tickets_clase_1.ticketsInstance.actualizarComentario(data.arrayTickets[0]);
        }
    }
});
socket.on('resCajas', (data) => {
    if (data.error == false) {
        if (data.repetir == false) {
            caja_clase_1.cajaInstance.confirmarCajaEnviada(data.infoCaja).then((res) => {
                if (res) {
                    (0, sincro_1.sincronizarCajas)();
                }
                else {
                    console.log("Error al actualizar el estado de la caja");
                }
            }).catch((err) => {
                console.log(err);
            });
        }
        else {
            caja_clase_1.cajaInstance.confirmarCajaHabiaLlegado(data.infoCaja).then((res) => {
                if (res) {
                    (0, sincro_1.sincronizarCajas)();
                }
                else {
                    console.log("Error al actualizar el estado de la caja 2");
                }
            }).catch((err) => {
                console.log(err);
            });
        }
    }
    else {
        console.log(data.mensaje);
    }
});
socket.on('resMovimientos', (data) => {
    if (data.error == false) {
        movimientos_clase_1.movimientosInstance.actualizarEstadoMovimiento(data.movimiento).then((res) => {
            if (res) {
                (0, sincro_1.sincronizarMovimientos)();
            }
            else {
                console.log("Error al actualizar el estado del movimiento");
            }
        }).catch((err) => {
            console.log(err);
        });
    }
    else {
        console.log(data.mensaje);
    }
});
socket.on('resFichajes', (data) => {
    if (data.error == false) {
        trabajadores_clase_1.trabajadoresInstance.actualizarEstadoFichaje(data.fichaje).then((res) => {
            if (res) {
                (0, sincro_1.sincronizarFichajes)();
            }
            else {
                console.log("Error al actualizar el estado del fichaje");
            }
        }).catch((err) => {
            console.log(err);
        });
    }
    else {
        console.log(data.mensaje);
    }
});
socket.on('resSincroDevoluciones', (data) => {
    if (!data.error) {
        devoluciones_clase_1.devolucionesInstance.actualizarEstadoDevolucion(data.devolucion).then((res) => {
            if (res) {
                (0, sincro_1.sincronizarDevoluciones)();
            }
            else {
                console.log('Error al actualizar el estadio de la devolución.');
            }
        }).catch((err) => {
            console.log(err);
        });
    }
    else {
        console.log(data.mensaje);
    }
});
//# sourceMappingURL=sanPedro.js.map