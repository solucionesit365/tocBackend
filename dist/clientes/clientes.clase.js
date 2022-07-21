"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clienteInstance = exports.Clientes = void 0;
const schClientes = require("./clientes.mongodb");
const axios_1 = require("axios");
const parametros_clase_1 = require("../parametros/parametros.clase");
class Clientes {
    constructor() {
        this.clienteVip = false;
    }
    buscar(cadena) {
        return schClientes.buscar(cadena).then((res) => {
            if (res.length > 0) {
                return res;
            }
            else {
                return [];
            }
        }).catch((err) => {
            console.log(err);
            return [];
        });
    }
    getClienteByID(idCliente) {
        return schClientes.getClieneteByID(idCliente).then((res) => {
            return res;
        }).catch((err) => {
            console.log(err);
            return null;
        });
    }
    insertarClientes(arrayClientes) {
        return schClientes.insertarClientes(arrayClientes).then((res) => {
            return res.acknowledged;
        }).catch((err) => {
            console.log(err);
            return false;
        });
    }
    getPuntosCliente(idClienteFinal) {
        return axios_1.default.post('clientes/getPuntosCliente', { database: parametros_clase_1.parametrosInstance.getParametros().database, idClienteFinal }).then((res) => {
            if (res.data.error == false) {
                return res.data.info;
            }
            else {
                console.log(res.data.error);
                return 0;
            }
        }).catch((err) => {
            console.log(err);
            return 0;
        });
    }
    setEstadoClienteVIP(nuevoEstado) {
        this.clienteVip = nuevoEstado;
    }
    getEstadoClienteVIP() {
        return this.clienteVip;
    }
}
exports.Clientes = Clientes;
exports.clienteInstance = new Clientes();
//# sourceMappingURL=clientes.clase.js.map