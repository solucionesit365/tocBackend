"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actualizarEstadoMovimiento = exports.limpiezaMovimientos = exports.getMovimientoMasAntiguo = exports.actualizarCodigoBarras = exports.resetContadorCodigoBarras = exports.getUltimoCodigoBarras = exports.nuevaSalida = exports.getMovimientosIntervalo = void 0;
const utiles_module_1 = require("../utiles/utiles.module");
const mongodb_1 = require("../conexion/mongodb");
async function getMovimientosIntervalo(inicioTime, finalTime) {
    const database = (await mongodb_1.conexion).db('tocgame');
    const movimientos = database.collection('movimientos');
    const resultado = await (await movimientos.find({ _id: { $lte: finalTime, $gte: inicioTime } })).toArray();
    return resultado;
}
exports.getMovimientosIntervalo = getMovimientosIntervalo;
async function nuevaSalida(data) {
    const database = (await mongodb_1.conexion).db('tocgame');
    const movimientos = database.collection('movimientos');
    const resultado = await movimientos.insertOne(data);
    return resultado;
}
exports.nuevaSalida = nuevaSalida;
async function getUltimoCodigoBarras() {
    const database = (await mongodb_1.conexion).db('tocgame');
    const codigoBarras = database.collection('codigo-barras');
    const resultado = await codigoBarras.findOne({ _id: 'CUENTA' });
    return resultado;
}
exports.getUltimoCodigoBarras = getUltimoCodigoBarras;
async function resetContadorCodigoBarras() {
    const database = (await mongodb_1.conexion).db('tocgame');
    const codigoBarras = database.collection('codigo-barras');
    const resultado = await codigoBarras.updateOne({ _id: 'CUENTA' }, { $set: { "ultimo": 0 } }, { upsert: true });
    return resultado;
}
exports.resetContadorCodigoBarras = resetContadorCodigoBarras;
async function actualizarCodigoBarras() {
    const database = (await mongodb_1.conexion).db('tocgame');
    const codigoBarras = database.collection('codigo-barras');
    const resultado = await codigoBarras.updateOne({ _id: 'CUENTA' }, { $inc: { ultimo: 1 } }, { upsert: true });
    return resultado;
}
exports.actualizarCodigoBarras = actualizarCodigoBarras;
async function getMovimientoMasAntiguo() {
    const database = (await mongodb_1.conexion).db('tocgame');
    const movimientos = database.collection('movimientos');
    const resultado = await movimientos.findOne({ enviado: false }, { sort: { _id: 1 } });
    return resultado;
}
exports.getMovimientoMasAntiguo = getMovimientoMasAntiguo;
async function limpiezaMovimientos() {
    const database = (await mongodb_1.conexion).db('tocgame');
    const movimientos = database.collection('movimientos');
    movimientos.deleteMany({ enviado: true, _id: { $lte: utiles_module_1.UtilesModule.restarDiasTimestamp(Date.now()) } });
}
exports.limpiezaMovimientos = limpiezaMovimientos;
async function actualizarEstadoMovimiento(movimiento) {
    const database = (await mongodb_1.conexion).db('tocgame');
    const movimientos = database.collection('movimientos');
    const resultado = movimientos.updateOne({ _id: movimiento._id }, { $set: {
            "enviado": movimiento.enviado,
            "intentos": movimiento.intentos,
            "comentario": movimiento.comentario
        } });
    return resultado;
}
exports.actualizarEstadoMovimiento = actualizarEstadoMovimiento;
//# sourceMappingURL=movimientos.mongodb.js.map