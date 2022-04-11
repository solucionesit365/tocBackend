"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ticketsInstance = exports.TicketsClase = void 0;
const schTickets = require("./tickets.mongodb");
const trabajadores_clase_1 = require("../trabajadores/trabajadores.clase");
const cestas_clase_1 = require("../cestas/cestas.clase");
const parametros_clase_1 = require("../parametros/parametros.clase");
const movimientos_clase_1 = require("../movimientos/movimientos.clase");
const articulos_clase_1 = require("../articulos/articulos.clase");
const axios_1 = require("axios");
const clientes_clase_1 = require("../clientes/clientes.clase");
class TicketsClase {
    getTicketByID(idTicket) {
        return schTickets.getTicketByID(idTicket).then((res) => {
            return res;
        }).catch((err) => {
            console.log(err);
            return null;
        });
    }
    getTicketsIntervalo(fechaInicio, fechaFinal) {
        return schTickets.getTicketsIntervalo(fechaInicio, fechaFinal).then((resultado) => {
            return resultado;
        }).catch((err) => {
            console.log(err);
            return null;
        });
    }
    getUltimoTicket() {
        return schTickets.getUltimoTicket().then((ultimoTicket) => {
            if (ultimoTicket != null) {
                return parametros_clase_1.parametrosInstance.getEspecialParametros().then((res) => {
                    if (res.ultimoTicket > ultimoTicket) {
                        return res.ultimoTicket;
                    }
                    return ultimoTicket;
                }).catch((err) => {
                    console.log(err.message);
                    return 0;
                });
            }
            else {
                return 0;
            }
        });
    }
    insertarTicket(ticket) {
        if (ticket.lista.length == 0) {
            const itemVacio = {
                _id: 5724,
                nombre: 'Lista rota',
                promocion: {
                    _id: null,
                    esPromo: false,
                },
                subtotal: ticket.total,
                unidades: 1
            };
            ticket.lista.push(itemVacio);
        }
        return schTickets.nuevoTicket(ticket).then((res) => {
            if (res.acknowledged) {
                if (ticket.regalo == true) {
                    axios_1.default.post('clientes/resetPuntosCliente', { database: parametros_clase_1.parametrosInstance.getParametros().database, idClienteFinal: ticket.cliente }).then((resultado) => {
                        if (resultado.data.error == false) {
                            console.log('Puntos reseteados');
                        }
                        else {
                            console.log(resultado.data.mensaje);
                        }
                    }).catch((err) => {
                        console.log(err);
                    });
                }
                articulos_clase_1.articulosInstance.setEstadoTarifaEspecial(false);
                clientes_clase_1.clienteInstance.setEstadoClienteVIP(false);
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
    async crearTicketEfectivo(total, idCesta, idCliente) {
        const infoTrabajador = await trabajadores_clase_1.trabajadoresInstance.getCurrentTrabajador();
        const nuevoIdTicket = (await this.getUltimoTicket()) + 1;
        const cesta = await cestas_clase_1.cestas.getCesta(idCesta);
        if (cesta == null || cesta.lista.length == 0) {
            console.log("Error, la cesta es null o está vacía");
            return false;
        }
        const objTicket = {
            _id: nuevoIdTicket,
            timestamp: Date.now(),
            total: total,
            lista: cesta.lista,
            tipoPago: "EFECTIVO",
            idTrabajador: infoTrabajador._id,
            tiposIva: cesta.tiposIva,
            cliente: (idCliente != '' && idCliente != null) ? (idCliente) : (null),
            infoClienteVip: {
                esVip: false,
                nif: '',
                nombre: '',
                cp: '',
                direccion: '',
                ciudad: ''
            },
            enviado: false,
            enTransito: false,
            intentos: 0,
            comentario: '',
            regalo: (cesta.regalo == true && idCliente != '' && idCliente != null) ? (true) : (false)
        };
        if (await this.insertarTicket(objTicket)) {
            if (await cestas_clase_1.cestas.borrarCesta(idCesta)) {
                if (await parametros_clase_1.parametrosInstance.setUltimoTicket(objTicket._id)) {
                    return true;
                }
                else {
                    console.log("Error no se ha podido cambiar el último id ticket");
                }
            }
            else {
                console.log("Error, no se ha podido borrar la cesta");
            }
        }
        else {
            console.log("Error, no se ha podido insertar el ticket");
        }
        return false;
    }
    async crearTicketDatafono3G(total, idCesta, idCliente) {
        const infoTrabajador = await trabajadores_clase_1.trabajadoresInstance.getCurrentTrabajador();
        const nuevoIdTicket = (await this.getUltimoTicket()) + 1;
        const cesta = await cestas_clase_1.cestas.getCesta(idCesta);
        if (cesta == null || cesta.lista.length == 0) {
            console.log("Error, la cesta es null o está vacía");
            return false;
        }
        const objTicket = {
            _id: nuevoIdTicket,
            timestamp: Date.now(),
            total: total,
            lista: cesta.lista,
            tipoPago: "TARJETA",
            idTrabajador: infoTrabajador._id,
            tiposIva: cesta.tiposIva,
            cliente: (idCliente != '' && idCliente != null) ? (idCliente) : (null),
            infoClienteVip: {
                esVip: false,
                nif: '',
                nombre: '',
                cp: '',
                direccion: '',
                ciudad: ''
            },
            enviado: false,
            enTransito: false,
            intentos: 0,
            comentario: '',
            regalo: (cesta.regalo == true && idCliente != '' && idCliente != null) ? (true) : (false)
        };
        if (await this.insertarTicket(objTicket)) {
            if (await cestas_clase_1.cestas.borrarCesta(idCesta)) {
                if (await parametros_clase_1.parametrosInstance.setUltimoTicket(objTicket._id)) {
                    movimientos_clase_1.movimientosInstance.nuevaSalida(objTicket.total, 'Targeta 3G', 'TARJETA', false, objTicket._id);
                    return true;
                }
                else {
                    console.log("Error no se ha podido cambiar el último id ticket");
                }
            }
            else {
                console.log("Error, no se ha podido borrar la cesta");
            }
        }
        else {
            console.log("Error, no se ha podido insertar el ticket");
        }
        return false;
    }
    async crearTicketTKRS(total, totalTkrs, idCesta, idCliente) {
        const infoTrabajador = await trabajadores_clase_1.trabajadoresInstance.getCurrentTrabajador();
        const nuevoIdTicket = (await this.getUltimoTicket()) + 1;
        const cesta = await cestas_clase_1.cestas.getCesta(idCesta);
        ;
        if (cesta == null || cesta.lista.length == 0) {
            console.log("Error, la cesta es null o está vacía");
            return false;
        }
        const objTicket = {
            _id: nuevoIdTicket,
            timestamp: Date.now(),
            total: total,
            lista: cesta.lista,
            tipoPago: "TKRS",
            idTrabajador: infoTrabajador._id,
            tiposIva: cesta.tiposIva,
            cliente: (idCliente != '' && idCliente != null) ? (idCliente) : (null),
            infoClienteVip: {
                esVip: false,
                nif: '',
                nombre: '',
                cp: '',
                direccion: '',
                ciudad: ''
            },
            enviado: false,
            enTransito: false,
            intentos: 0,
            comentario: '',
            regalo: (cesta.regalo == true && idCliente != '' && idCliente != null) ? (true) : (false)
        };
        if (await this.insertarTicket(objTicket)) {
            if (await cestas_clase_1.cestas.borrarCesta(idCesta)) {
                if (await parametros_clase_1.parametrosInstance.setUltimoTicket(objTicket._id)) {
                    objTicket['cantidadTkrs'] = totalTkrs;
                    const diferencia = total - totalTkrs;
                    if (diferencia >= 0) {
                        return movimientos_clase_1.movimientosInstance.nuevaSalida(objTicket.total, `Pagat TkRs (TkRs): ${objTicket._id}`, 'TKRS_SIN_EXCESO', false, objTicket._id).then((salida0) => {
                            return salida0;
                        }).catch((err) => {
                            console.log(err);
                            return false;
                        });
                    }
                    else {
                        return movimientos_clase_1.movimientosInstance.nuevaSalida(Number((diferencia * -1).toFixed(2)), `Pagat TkRs (TkRs): ${objTicket._id}`, 'TKRS_CON_EXCESO', false, objTicket._id).then((salida1) => {
                            if (salida1) {
                                return movimientos_clase_1.movimientosInstance.nuevaSalida(objTicket.total, `Pagat TkRs (TkRs): ${objTicket._id}`, 'TKRS_SIN_EXCESO', false, objTicket._id).then((salida2) => {
                                    return salida2;
                                }).catch((err) => {
                                    console.log(err);
                                    return false;
                                });
                            }
                            else {
                                return false;
                            }
                        }).catch((err) => {
                            console.log(err);
                            return false;
                        });
                    }
                }
                else {
                    console.log("Error no se ha podido cambiar el último id ticket");
                }
            }
            else {
                console.log("Error, no se ha podido borrar la cesta");
            }
        }
        else {
            console.log("Error, no se ha podido insertar el ticket");
        }
        return false;
    }
    async crearTicketDeuda(total, idCesta, idCliente, infoClienteVip) {
        const infoTrabajador = await trabajadores_clase_1.trabajadoresInstance.getCurrentTrabajador();
        const nuevoIdTicket = (await this.getUltimoTicket()) + 1;
        const cesta = await cestas_clase_1.cestas.getCesta(idCesta);
        if (cesta == null || cesta.lista.length == 0) {
            console.log("Error, la cesta es null o está vacía");
            return false;
        }
        const objTicket = {
            _id: nuevoIdTicket,
            timestamp: Date.now(),
            total: total,
            lista: cesta.lista,
            tipoPago: "DEUDA",
            idTrabajador: infoTrabajador._id,
            tiposIva: cesta.tiposIva,
            cliente: (idCliente != '' && idCliente != null) ? (idCliente) : (null),
            infoClienteVip: {
                esVip: infoClienteVip.esVip,
                nif: infoClienteVip.nif,
                nombre: infoClienteVip.nombre,
                cp: infoClienteVip.cp,
                direccion: infoClienteVip.direccion,
                ciudad: infoClienteVip.ciudad
            },
            enTransito: false,
            enviado: false,
            intentos: 0,
            comentario: ''
        };
        if (await this.insertarTicket(objTicket)) {
            if (await cestas_clase_1.cestas.borrarCesta(idCesta)) {
                if (await parametros_clase_1.parametrosInstance.setUltimoTicket(objTicket._id)) {
                    movimientos_clase_1.movimientosInstance.nuevaSalida(objTicket.total, `Deute client: ${objTicket._id}`, 'DEUDA', false, objTicket._id);
                    return true;
                }
                else {
                    console.log("Error no se ha podido cambiar el último id ticket");
                }
            }
            else {
                console.log("Error, no se ha podido borrar la cesta");
            }
        }
        else {
            console.log("Error, no se ha podido insertar el ticket");
        }
        return false;
    }
    async crearTicketConsumoPersonal(idCesta) {
        const infoTrabajador = await trabajadores_clase_1.trabajadoresInstance.getCurrentTrabajador();
        const nuevoIdTicket = (await this.getUltimoTicket()) + 1;
        const cesta = await cestas_clase_1.cestas.getCesta(idCesta);
        if (cesta == null || cesta.lista.length == 0) {
            console.log("Error, la cesta es null o está vacía");
            return false;
        }
        const objTicket = {
            _id: nuevoIdTicket,
            timestamp: Date.now(),
            total: 0,
            lista: cesta.lista,
            tipoPago: "CONSUMO_PERSONAL",
            idTrabajador: infoTrabajador._id,
            tiposIva: cesta.tiposIva,
            cliente: null,
            infoClienteVip: {
                esVip: false,
                nif: '',
                nombre: '',
                cp: '',
                direccion: '',
                ciudad: ''
            },
            enTransito: false,
            enviado: false,
            intentos: 0,
            comentario: ''
        };
        if (await this.insertarTicket(objTicket)) {
            if (await cestas_clase_1.cestas.borrarCesta(idCesta)) {
                if (await parametros_clase_1.parametrosInstance.setUltimoTicket(objTicket._id)) {
                    return true;
                }
                else {
                    console.log("Error no se ha podido cambiar el último id ticket");
                }
            }
            else {
                console.log("Error, no se ha podido borrar la cesta");
            }
        }
        else {
            console.log("Error, no se ha podido insertar el ticket");
        }
        return false;
    }
    getTicketMasAntiguo() {
        return schTickets.getTicketMasAntiguo();
    }
    actualizarEstadoTicket(ticket) {
        return schTickets.actualizarEstadoTicket(ticket).then((res) => {
            return res.acknowledged;
        }).catch((err) => {
            console.log(err);
            return false;
        });
    }
    actualizarComentario(ticket) {
        return schTickets.actualizarComentario(ticket).then((res) => {
            return res.acknowledged;
        }).catch((err) => {
            console.log(err);
            return false;
        });
    }
}
exports.TicketsClase = TicketsClase;
exports.ticketsInstance = new TicketsClase();
//# sourceMappingURL=tickets.clase.js.map