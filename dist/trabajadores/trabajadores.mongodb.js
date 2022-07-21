"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.existePlan = exports.actualizarEstadoFichaje = exports.getTrabajaronAyer = exports.getFichajeMasAntiguo = exports.insertarTrabajadores = exports.borrarTrabajadores = exports.buscarTrabajadoresFichados = exports.insertNuevoFichaje = exports.desficharTrabajador = exports.ficharTrabajador = exports.getTrabajadoresFichados = exports.setCurrentIdTrabajador = exports.getTrabajadorPorNombre = exports.getTrabajador = exports.buscar = exports.limpiezaFichajes = exports.getCurrentIdTrabajador = void 0;
const utiles_module_1 = require("../utiles/utiles.module");
const mongodb_1 = require("../conexion/mongodb");
async function getCurrentIdTrabajador() {
    const database = (await mongodb_1.conexion).db('tocgame');
    const parametros = database.collection('parametros');
    const resultado = await parametros.findOne({ _id: "PARAMETROS" });
    return resultado;
}
exports.getCurrentIdTrabajador = getCurrentIdTrabajador;
async function limpiezaFichajes() {
    const database = (await mongodb_1.conexion).db('tocgame');
    const fichajes = database.collection('sincro-fichajes');
    fichajes.deleteMany({ enviado: true, _id: { $lte: utiles_module_1.UtilesModule.restarDiasTimestamp(Date.now()) } });
}
exports.limpiezaFichajes = limpiezaFichajes;
async function buscar(busqueda) {
    const database = (await mongodb_1.conexion).db('tocgame');
    const trabajadores = database.collection('trabajadores');
    const resultado = await trabajadores.find({ $or: [{ "nombre": { '$regex': new RegExp(busqueda, "i") } }, { "nombreCorto": { '$regex': new RegExp(busqueda, "i") } }] }, { limit: 4 });
    const arrayTrabajadores = await resultado.toArray();
    return arrayTrabajadores;
}
exports.buscar = buscar;
async function getTrabajador(idTrabajador) {
    const database = (await mongodb_1.conexion).db('tocgame');
    const trabajadores = database.collection('trabajadores');
    const resultado = await trabajadores.findOne({ _id: idTrabajador });
    return resultado;
}
exports.getTrabajador = getTrabajador;
async function getTrabajadorPorNombre(id) {
    const database = (await mongodb_1.conexion).db('tocgame');
    const trabajadores = database.collection('trabajadores');
    const resultado = await trabajadores.findOne({ idTrabajador: id });
    return resultado;
}
exports.getTrabajadorPorNombre = getTrabajadorPorNombre;
async function setCurrentIdTrabajador(idTrabajador) {
    const database = (await mongodb_1.conexion).db('tocgame');
    const parametros = database.collection('parametros');
    const resultado = await parametros.updateOne({ _id: "PARAMETROS" }, { $set: { "idCurrentTrabajador": idTrabajador } }, { upsert: true });
    return resultado;
}
exports.setCurrentIdTrabajador = setCurrentIdTrabajador;
async function getTrabajadoresFichados() {
    const database = (await mongodb_1.conexion).db('tocgame');
    const trabajadores = database.collection('trabajadores');
    const resultado = (await trabajadores.find({ fichado: true })).toArray();
    return resultado;
}
exports.getTrabajadoresFichados = getTrabajadoresFichados;
async function ficharTrabajador(idTrabajador) {
    const database = (await mongodb_1.conexion).db('tocgame');
    const trabajadores = database.collection('trabajadores');
    const resultado = trabajadores.updateOne({ _id: idTrabajador }, { $set: { "fichado": true } });
    return resultado;
}
exports.ficharTrabajador = ficharTrabajador;
async function desficharTrabajador(idTrabajador) {
    const database = (await mongodb_1.conexion).db('tocgame');
    const trabajadores = database.collection('trabajadores');
    const resultado = trabajadores.updateOne({ _id: idTrabajador }, { $set: { "fichado": false } });
    return resultado;
}
exports.desficharTrabajador = desficharTrabajador;
async function insertNuevoFichaje(data) {
    const database = (await mongodb_1.conexion).db('tocgame');
    const sincrofichajes = database.collection('sincro-fichajes');
    const resultado = sincrofichajes.insertOne(data);
    return resultado;
}
exports.insertNuevoFichaje = insertNuevoFichaje;
async function buscarTrabajadoresFichados() {
    const database = (await mongodb_1.conexion).db('tocgame');
    const trabajadores = database.collection('trabajadores');
    const resultado = await (await trabajadores.find({ fichado: true })).toArray();
    return resultado;
}
exports.buscarTrabajadoresFichados = buscarTrabajadoresFichados;
async function borrarTrabajadores() {
    try {
        const database = (await mongodb_1.conexion).db('tocgame');
        const trabajadores = database.collection('trabajadores');
        const resultado = await trabajadores.drop();
        return resultado;
    }
    catch (err) {
        if (err.codeName == 'NamespaceNotFound') {
            return true;
        }
        else {
            return false;
        }
    }
}
exports.borrarTrabajadores = borrarTrabajadores;
async function insertarTrabajadores(arrayTrabajadores) {
    if (await borrarTrabajadores()) {
        const database = (await mongodb_1.conexion).db('tocgame');
        const trabajadores = database.collection('trabajadores');
        const resultado = await trabajadores.insertMany(arrayTrabajadores);
        return resultado;
    }
    else {
        const res = {
            acknowledged: false,
            insertedCount: 0,
            insertedIds: null
        };
        return res;
    }
}
exports.insertarTrabajadores = insertarTrabajadores;
async function getFichajeMasAntiguo() {
    const database = (await mongodb_1.conexion).db('tocgame');
    const sincroFichajes = database.collection('sincro-fichajes');
    const resultado = await sincroFichajes.findOne({ enviado: false }, { sort: { _id: 1 } });
    return resultado;
}
exports.getFichajeMasAntiguo = getFichajeMasAntiguo;
async function getTrabajaronAyer(inicioTime, finalTime) {
    const database = (await mongodb_1.conexion).db('tocgame');
    const sincroFichajes = database.collection('sincro-fichajes');
    const resultado = await sincroFichajes.find({ $and: [{ _id: { $gte: inicioTime } }, { _id: { $lte: finalTime } }, { tipo: "SALIDA" }] }).toArray();
    return resultado;
}
exports.getTrabajaronAyer = getTrabajaronAyer;
async function actualizarEstadoFichaje(fichaje) {
    const database = (await mongodb_1.conexion).db('tocgame');
    const sincroFichajes = database.collection('sincro-fichajes');
    const resultado = sincroFichajes.updateOne({ _id: fichaje._id }, { $set: {
            "enviado": fichaje.enviado,
            "intentos": fichaje.intentos,
            "comentario": fichaje.comentario
        } });
    return resultado;
}
exports.actualizarEstadoFichaje = actualizarEstadoFichaje;
async function existePlan(idPlan) {
    const database = (await mongodb_1.conexion).db('tocgame');
    const sincroFichajes = database.collection('sincro-fichajes');
    const resultado = sincroFichajes.findOne({ idPlan: idPlan });
    return resultado;
}
exports.existePlan = existePlan;
//# sourceMappingURL=trabajadores.mongodb.js.map