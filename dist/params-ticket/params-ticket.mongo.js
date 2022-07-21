"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.borrarInfoTicket = exports.getParamsTicket = exports.insertarParametrosTicket = void 0;
const mongodb_1 = require("../conexion/mongodb");
async function insertarParametrosTicket(data) {
    if (borrarInfoTicket()) {
        const database = (await mongodb_1.conexion).db('tocgame');
        const paramTickets = database.collection('parametros-tickets');
        const resultado = await paramTickets.insertMany(data);
        return resultado.acknowledged;
    }
    else {
        const res = {
            acknowledged: false,
            insertedCount: 0,
            insertedIds: null
        };
        return res.acknowledged;
    }
}
exports.insertarParametrosTicket = insertarParametrosTicket;
async function getParamsTicket() {
    const database = (await mongodb_1.conexion).db('tocgame');
    const paramTickets = database.collection('parametros-tickets');
    const arrayResult = await (await paramTickets.find({})).toArray();
    return arrayResult;
}
exports.getParamsTicket = getParamsTicket;
async function borrarInfoTicket() {
    try {
        const database = (await mongodb_1.conexion).db('tocgame');
        const paramTickets = database.collection('parametros-tickets');
        const resultado = await paramTickets.drop();
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
exports.borrarInfoTicket = borrarInfoTicket;
//# sourceMappingURL=params-ticket.mongo.js.map