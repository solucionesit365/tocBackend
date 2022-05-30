"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transaccionesInstance = void 0;
const cestas_clase_1 = require("../cestas/cestas.clase");
const cestas_interface_1 = require("../cestas/cestas.interface");
const schTransacciones = require("./transacciones.mongodb");
class TransaccionesClass {
    crearTransaccion(cesta, total, idCliente) {
        return schTransacciones.crearTransaccion(cesta, total, idCliente).then((res) => {
            if (res.acknowledged) {
                return { error: false, insertedId: res.insertedId.toString() };
            }
            else {
                return { error: true, mensaje: 'Error, no se ha podido insertar la transacción' };
            }
        }).catch((err) => {
            console.log(err.message);
            return { error: true, mensaje: 'Error en CATCH transacciones.class/crearTransaccion' };
        });
    }
    getTransaccionById(idTransaccion) {
        return schTransacciones.getTransaccionById(idTransaccion).then((res) => {
            return res;
        }).catch((err) => {
            console.log(err);
            return null;
        });
    }
    setPagada(idTransaccion) {
        return schTransacciones.setPagada(idTransaccion).catch((err) => {
            console.log(err);
            return false;
        });
    }
    getUltimaTransaccion() {
        return schTransacciones.getUltimaTransaccion().then((res) => {
            if (res.length == 1) {
                return res[0];
            }
            return null;
        }).catch((err) => {
            console.log(err);
            return null;
        });
    }
}
exports.transaccionesInstance = new TransaccionesClass();
//# sourceMappingURL=transacciones.class.js.map