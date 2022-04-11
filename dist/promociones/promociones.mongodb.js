"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertarPromociones = exports.borrarPromociones = exports.getPromociones = void 0;
const mongodb_1 = require("../conexion/mongodb");
async function getPromociones() {
    const database = (await mongodb_1.conexion).db('tocgame');
    const promociones = database.collection('promociones');
    const resultado = await (await promociones.find()).toArray();
    return resultado;
}
exports.getPromociones = getPromociones;
async function borrarPromociones() {
    try {
        const database = (await mongodb_1.conexion).db('tocgame');
        const promociones = database.collection('promociones');
        const resultado = await promociones.drop();
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
exports.borrarPromociones = borrarPromociones;
async function insertarPromociones(arrayPromociones) {
    if (await borrarPromociones()) {
        const database = (await mongodb_1.conexion).db('tocgame');
        const promociones = database.collection('promociones');
        const resultado = await promociones.insertMany(arrayPromociones);
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
exports.insertarPromociones = insertarPromociones;
//# sourceMappingURL=promociones.mongodb.js.map