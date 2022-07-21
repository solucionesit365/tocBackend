"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cambiarPosTecla = exports.borrarArticulos = exports.insertarTeclas = void 0;
const mongodb_1 = require("../conexion/mongodb");
async function insertarTeclas(arrayTeclas) {
    if (await borrarArticulos()) {
        const database = (await mongodb_1.conexion).db('tocgame');
        const articulos = database.collection('teclas');
        const resultado = await articulos.insertMany(arrayTeclas);
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
exports.insertarTeclas = insertarTeclas;
async function borrarArticulos() {
    try {
        const database = (await mongodb_1.conexion).db('tocgame');
        const articulos = database.collection('teclas');
        const resultado = await articulos.drop();
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
exports.borrarArticulos = borrarArticulos;
async function cambiarPosTecla(idArticle, nuevaPos, nombreMenu) {
    const database = (await mongodb_1.conexion).db('tocgame');
    const articulos = database.collection('teclas');
    const resultado = await articulos.updateOne({ idArticle: idArticle }, { $set: { pos: nuevaPos, nomMenu: nombreMenu } });
    return resultado;
}
exports.cambiarPosTecla = cambiarPosTecla;
//# sourceMappingURL=teclado.mongodb.js.map