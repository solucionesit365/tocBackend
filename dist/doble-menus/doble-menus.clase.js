"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dobleMenusInstance = exports.DobleMenusClase = void 0;
const schDobleMenus = require("./doble-menus.mongodb");
class DobleMenusClase {
    constructor() {
        this.bloqueado = false;
    }
    clickMenu(nombreMenu) {
    }
    getBloqueado() {
        return this.bloqueado;
    }
    getMenus() {
        return schDobleMenus.getMenus();
    }
    setBloqueado(x) {
        this.bloqueado = x;
    }
    insertarMenus(arrayMenus) {
        if (arrayMenus.length <= 0)
            return [];
        return schDobleMenus.insertarMenus(arrayMenus).then((res) => {
            return res.acknowledged;
        }).catch((err) => {
            console.log(err);
            return false;
        });
    }
}
exports.DobleMenusClase = DobleMenusClase;
exports.dobleMenusInstance = new DobleMenusClase();
//# sourceMappingURL=doble-menus.clase.js.map