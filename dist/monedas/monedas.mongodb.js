"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setMonedas = void 0;
const mongodb_1 = require("../conexion/mongodb");
async function setMonedas(data) {
    const database = (await mongodb_1.conexion).db('tocgame');
    const monedas = database.collection('monedas');
    const resultado = await monedas.replaceOne({ _id: "INFO_MONEDAS" }, data, { upsert: true });
    return resultado;
}
exports.setMonedas = setMonedas;
//# sourceMappingURL=monedas.mongodb.js.map