"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setIpPaytef = exports.setVidAndPid = exports.setUltimoTicket = exports.getLicencia = exports.setParametros = exports.getParametros = void 0;
const mongodb_1 = require("../conexion/mongodb");
async function getParametros() {
    const database = (await mongodb_1.conexion).db('tocgame');
    const parametros = database.collection('parametros');
    const resultado = await parametros.findOne({ _id: "PARAMETROS" });
    return resultado;
}
exports.getParametros = getParametros;
async function setParametros(params) {
    const database = (await mongodb_1.conexion).db('tocgame');
    const parametros = database.collection('parametros');
    const resultado = await parametros.updateOne({ _id: "PARAMETROS" }, { $set: params }, { upsert: true });
    return resultado;
}
exports.setParametros = setParametros;
async function getLicencia() {
    const database = (await mongodb_1.conexion).db('tocgame');
    const parametros = database.collection('parametros');
    const resultado = await parametros.findOne({ _id: "PARAMETROS" });
    return resultado;
}
exports.getLicencia = getLicencia;
async function setUltimoTicket(idTicket) {
    const database = (await mongodb_1.conexion).db('tocgame');
    const parametros = database.collection('parametros');
    const resultado = await parametros.updateOne({ _id: "PARAMETROS" }, { $set: { "ultimoTicket": idTicket } }, { upsert: true });
    return resultado;
}
exports.setUltimoTicket = setUltimoTicket;
async function setVidAndPid(vid, pid, com) {
    const database = (await mongodb_1.conexion).db('tocgame');
    const parametros = database.collection('parametros');
    const resultado = await parametros.updateOne({ _id: "PARAMETROS" }, { $set: { "impresoraUsbInfo": { vid: vid, pid: pid }, visor: com } }, { upsert: true });
    return resultado;
}
exports.setVidAndPid = setVidAndPid;
async function setIpPaytef(ip) {
    const database = (await mongodb_1.conexion).db('tocgame');
    const parametros = database.collection('parametros');
    const resultado = await parametros.updateOne({ _id: "PARAMETROS" }, { $set: { "ipTefpay": ip } }, { upsert: true });
    return resultado;
}
exports.setIpPaytef = setIpPaytef;
//# sourceMappingURL=parametros.mongodb.js.map