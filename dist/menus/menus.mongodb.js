"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubmenus = exports.insertarMenus = exports.borrarMenus = exports.getTecladoMain = exports.getMenus = void 0;
const mongodb_1 = require("../conexion/mongodb");
async function getMenus() {
    const database = (await mongodb_1.conexion).db('tocgame');
    const menus = database.collection('menus');
    const resultado = await (await menus.find()).toArray();
    return resultado;
}
exports.getMenus = getMenus;
async function getTecladoMain(nombreMenu) {
    const database = (await mongodb_1.conexion).db('tocgame');
    const teclas = database.collection('teclas');
    const resultado = await (teclas.find({ nomMenu: nombreMenu })).toArray();
    return resultado;
}
exports.getTecladoMain = getTecladoMain;
async function borrarMenus() {
    try {
        const database = (await mongodb_1.conexion).db('tocgame');
        const menus = database.collection('menus');
        const resultado = await menus.drop();
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
exports.borrarMenus = borrarMenus;
async function insertarMenus(arrayMenus) {
    if (await borrarMenus()) {
        const database = (await mongodb_1.conexion).db('tocgame');
        const menus = database.collection('menus');
        const resultado = menus.insertMany(arrayMenus);
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
exports.insertarMenus = insertarMenus;
async function getSubmenus(tag) {
    const database = (await mongodb_1.conexion).db('tocgame');
    const menus = database.collection('menus');
    const resultado = await (await menus.find({ tag: tag })).toArray();
    return resultado;
}
exports.getSubmenus = getSubmenus;
//# sourceMappingURL=menus.mongodb.js.map