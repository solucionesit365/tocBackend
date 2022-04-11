"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDevolucionByID = exports.actualizarEstadoDevolucion = exports.getDevolucionMasAntigua = exports.insertarDevolucion = void 0;
const mongodb_1 = require("../conexion/mongodb");
async function insertarDevolucion(data) {
    const database = (await mongodb_1.conexion).db('tocgame');
    const devoluciones = database.collection('devoluciones');
    const resultado = await devoluciones.insertOne(data);
    return resultado;
}
exports.insertarDevolucion = insertarDevolucion;
async function getDevolucionMasAntigua() {
    const database = (await mongodb_1.conexion).db('tocgame');
    const devolucion = database.collection('devoluciones');
    const resultado = await devolucion.findOne({ enviado: false }, { sort: { timestamp: 1 } });
    return resultado;
}
exports.getDevolucionMasAntigua = getDevolucionMasAntigua;
async function actualizarEstadoDevolucion(devolucion) {
    const database = (await mongodb_1.conexion).db('tocgame');
    const sincroFichajes = database.collection('devoluciones');
    const resultado = await sincroFichajes.updateOne({ _id: devolucion._id }, { $set: {
            "enviado": devolucion.enviado,
            "intentos": devolucion.intentos,
            "comentario": devolucion.comentario
        } });
    return resultado;
}
exports.actualizarEstadoDevolucion = actualizarEstadoDevolucion;
async function getDevolucionByID(id) {
    const database = (await mongodb_1.conexion).db('tocgame');
    const devoluciones = database.collection('devoluciones');
    const resultado = devoluciones.findOne({ _id: id });
    return resultado;
}
exports.getDevolucionByID = getDevolucionByID;
//# sourceMappingURL=devoluciones.mongodb.js.map