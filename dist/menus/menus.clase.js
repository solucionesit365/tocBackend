"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.menusInstance = exports.MenusClase = void 0;
const schMenus = require("./menus.mongodb");
class MenusClase {
    constructor() {
        this.bloqueado = false;
    }
    clickMenu(nombreMenu) {
        return schMenus.getTecladoMain(nombreMenu);
    }
    getBloqueado() {
        return this.bloqueado;
    }
    getMenus() {
        return schMenus.getMenus();
    }
    setBloqueado(x) {
        this.bloqueado = x;
    }
    insertarMenus(arrayMenus) {
        return schMenus.insertarMenus(arrayMenus).then((res) => {
            return res.acknowledged;
        }).catch((err) => {
            console.log(err);
            return false;
        });
    }
    getSubmenus(tag) {
        return schMenus.getSubmenus(tag);
    }
}
exports.MenusClase = MenusClase;
exports.menusInstance = new MenusClase();
//# sourceMappingURL=menus.clase.js.map