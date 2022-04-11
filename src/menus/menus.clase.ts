import * as schMenus from "./menus.mongodb";

export class MenusClase {
    private bloqueado: boolean;

    constructor() {
        this.bloqueado = false;
    }

    clickMenu(nombreMenu: string) {
        return schMenus.getTecladoMain(nombreMenu);
    }

    getBloqueado() {
        return this.bloqueado;
    }

    getMenus() {
        return schMenus.getMenus();
    }
    
    setBloqueado(x: boolean) {
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

export const menusInstance = new MenusClase();