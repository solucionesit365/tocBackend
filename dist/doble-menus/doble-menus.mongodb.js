"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertarMenus = exports.borrarMenus = exports.getMenus = void 0;
const mongodb_1 = require("../conexion/mongodb");
async function getMenus() {
    const database = (await mongodb_1.conexion).db('tocgame');
    const menus = database.collection('doble-menus');
    const resultado = await (await menus.find()).toArray();
    return resultado;
}
exports.getMenus = getMenus;
async function borrarMenus() {
    try {
        const database = (await mongodb_1.conexion).db('tocgame');
        const menus = database.collection('doble-menus');
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
        const menus = database.collection('doble-menus');
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
//# sourceMappingURL=doble-menus.mongodb.js.map