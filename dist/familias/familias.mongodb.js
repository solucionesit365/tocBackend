"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertarFamilias = void 0;
const mongodb_1 = require("../conexion/mongodb");
async function insertarFamilias(arrayFamilias) {
    const database = (await mongodb_1.conexion).db('tocgame');
    const familias = database.collection('familias');
    const resultado = await familias.insertMany(arrayFamilias);
    return resultado;
}
exports.insertarFamilias = insertarFamilias;
//# sourceMappingURL=familias.mongodb.js.map