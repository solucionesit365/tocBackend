"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCajaMasAntigua = exports.confirmarCajaHabiaLlegado = exports.confirmarCajaEnviada = exports.nuevoItemSincroCajas = exports.borrarCaja = exports.setInfoCaja = exports.getMonedas = exports.guardarMonedas = exports.limpiezaCajas = exports.getInfoCaja = void 0;
const utiles_module_1 = require("../utiles/utiles.module");
const mongodb_1 = require("../conexion/mongodb");
async function getInfoCaja() {
    const database = (await mongodb_1.conexion).db('tocgame');
    const caja = database.collection('cajas');
    const resultado = await caja.findOne({ _id: "CAJA" });
    return resultado;
}
exports.getInfoCaja = getInfoCaja;
async function limpiezaCajas() {
    const database = (await mongodb_1.conexion).db('tocgame');
    const sincroCajas = database.collection('sincro-cajas');
    sincroCajas.deleteMany({ enviado: true, _id: { $lte: utiles_module_1.UtilesModule.restarDiasTimestamp(Date.now()) } });
}
exports.limpiezaCajas = limpiezaCajas;
async function guardarMonedas(arrayMonedas, tipo) {
    const database = (await mongodb_1.conexion).db('tocgame');
    const caja = database.collection('infoMonedas');
    const resultado = await caja.updateOne({ _id: tipo }, { $set: { "array": arrayMonedas } }, { upsert: true });
    return resultado;
}
exports.guardarMonedas = guardarMonedas;
async function getMonedas(tipo) {
    const database = (await mongodb_1.conexion).db('tocgame');
    const caja = database.collection('infoMonedas');
    const resultado = await caja.findOne({ _id: tipo });
    return resultado;
}
exports.getMonedas = getMonedas;
async function setInfoCaja(data) {
    const database = (await mongodb_1.conexion).db('tocgame');
    const caja = database.collection('cajas');
    const resultado = await caja.replaceOne({
        _id: "CAJA"
    }, data, { upsert: true });
    return resultado;
}
exports.setInfoCaja = setInfoCaja;
async function borrarCaja() {
    const database = (await mongodb_1.conexion).db('tocgame');
    const caja = database.collection('cajas');
    const resultado = await caja.drop();
    return resultado;
}
exports.borrarCaja = borrarCaja;
async function nuevoItemSincroCajas(unaCaja) {
    const database = (await mongodb_1.conexion).db('tocgame');
    const sincroCajas = database.collection('sincro-cajas');
    const resultado = await sincroCajas.insertOne(unaCaja);
    return resultado;
}
exports.nuevoItemSincroCajas = nuevoItemSincroCajas;
async function confirmarCajaEnviada(unaCaja) {
    const database = (await mongodb_1.conexion).db('tocgame');
    const sincroCajas = database.collection('sincro-cajas');
    const resultado = await sincroCajas.updateOne({ _id: unaCaja._id }, { $set: {
            "enviado": unaCaja.enviado
        } });
    return resultado;
}
exports.confirmarCajaEnviada = confirmarCajaEnviada;
async function confirmarCajaHabiaLlegado(unaCaja) {
    const database = (await mongodb_1.conexion).db('tocgame');
    const sincroCajas = database.collection('sincro-cajas');
    const resultado = await sincroCajas.updateOne({ _id: unaCaja._id }, { $set: {
            "enviado": unaCaja.enviado,
            "comentario": unaCaja.comentario
        } });
    return resultado;
}
exports.confirmarCajaHabiaLlegado = confirmarCajaHabiaLlegado;
async function getCajaMasAntigua() {
    const database = (await mongodb_1.conexion).db('tocgame');
    const sincroCajas = database.collection('sincro-cajas');
    const resultado = await (await sincroCajas.find({ enviado: false }, { sort: { _id: 1 }, limit: 1 })).toArray();
    return resultado;
}
exports.getCajaMasAntigua = getCajaMasAntigua;
//# sourceMappingURL=caja.mongodb.js.map