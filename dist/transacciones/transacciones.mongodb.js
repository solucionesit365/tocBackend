"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPagada = exports.getUltimaTransaccion = exports.getTransaccionById = exports.crearTransaccion = void 0;
const mongodb_1 = require("mongodb");
const cestas_interface_1 = require("../cestas/cestas.interface");
const mongodb_2 = require("../conexion/mongodb");
async function crearTransaccion(cesta, total, idCliente) {
    const database = (await mongodb_2.conexion).db('tocgame');
    const transacciones = database.collection('transacciones');
    const resultado = await transacciones.insertOne({
        total: total,
        idCliente: idCliente,
        cesta: cesta,
        pagado: false,
        timestamp: Date.now()
    });
    return resultado;
}
exports.crearTransaccion = crearTransaccion;
async function getTransaccionById(idTransaccion) {
    const database = (await mongodb_2.conexion).db('tocgame');
    const transacciones = database.collection('transacciones');
    const resultado = await transacciones.findOne({
        _id: new mongodb_1.ObjectId(idTransaccion)
    });
    return resultado;
}
exports.getTransaccionById = getTransaccionById;
async function getUltimaTransaccion() {
    const database = (await mongodb_2.conexion).db('tocgame');
    const transacciones = database.collection('transacciones');
    const resultado = await transacciones.find().sort({ _id: -1 }).limit(1).toArray();
    return resultado;
}
exports.getUltimaTransaccion = getUltimaTransaccion;
async function setPagada(idTransaccion) {
    const database = (await mongodb_2.conexion).db('tocgame');
    const transacciones = database.collection('transacciones');
    const resultado = await transacciones.updateOne({
        _id: new mongodb_1.ObjectId(idTransaccion)
    }, { $set: { 'pagado': false } });
    return resultado;
}
exports.setPagada = setPagada;
//# sourceMappingURL=transacciones.mongodb.js.map