"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editarArticulo = exports.getSuplementos = exports.getInfoArticuloTarifaEspecial = exports.borrarArticulos = exports.insertarArticulos = exports.getInfoArticulo = void 0;
const mongodb_1 = require("../conexion/mongodb");
async function getInfoArticulo(idArticulo) {
    const database = (await mongodb_1.conexion).db('tocgame');
    const articulos = database.collection('articulos');
    const resultado = await articulos.findOne({ _id: idArticulo });
    return resultado;
}
exports.getInfoArticulo = getInfoArticulo;
async function insertarArticulos(arrayArticulos, esTarifaEspecial = false) {
    const apuntoColeccion = (esTarifaEspecial == true) ? ('articulosTarifaEspecial') : ('articulos');
    if (await borrarArticulos(esTarifaEspecial)) {
        const database = (await mongodb_1.conexion).db('tocgame');
        const articulos = database.collection(apuntoColeccion);
        const resultado = await articulos.insertMany(arrayArticulos);
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
exports.insertarArticulos = insertarArticulos;
async function borrarArticulos(esTarifaEspecial) {
    try {
        const apuntoColeccion = (esTarifaEspecial == true) ? ('articulosTarifaEspecial') : ('articulos');
        const database = (await mongodb_1.conexion).db('tocgame');
        const articulos = database.collection(apuntoColeccion);
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
async function getInfoArticuloTarifaEspecial(idArticulo) {
    const database = (await mongodb_1.conexion).db('tocgame');
    const articulos = database.collection('articulosTarifaEspecial');
    const resultado = await articulos.findOne({ _id: idArticulo });
    return resultado;
}
exports.getInfoArticuloTarifaEspecial = getInfoArticuloTarifaEspecial;
async function getSuplementos(suplementos) {
    const database = (await mongodb_1.conexion).db('tocgame');
    const articulos = database.collection('articulos');
    const suplementosData = [];
    for (let i in suplementos) {
        const resultado = await (await articulos.find({ _id: suplementos[i] })).toArray();
        suplementosData.push(resultado[0]);
    }
    return suplementosData;
}
exports.getSuplementos = getSuplementos;
async function editarArticulo(id, nombre, precioBase, precioConIva) {
    const database = (await mongodb_1.conexion).db('tocgame');
    const articulos = database.collection('articulos');
    const teclas = database.collection('teclas');
    await teclas.updateMany({ idArticle: id }, { $set: { 'nombreArticulo': nombre } }, { upsert: true });
    console.log(id, nombre, precioBase, precioConIva);
    return await articulos.updateOne({ _id: id }, { $set: { 'nombre': nombre, 'precioBase': precioBase, 'precioConIva': precioConIva } }, { upsert: true });
}
exports.editarArticulo = editarArticulo;
//# sourceMappingURL=articulos.mongodb.js.map