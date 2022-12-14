import * as schDobleMenus from './doble-menus.mongodb';
import { logger } from "../logger";

export class DobleMenusClase {
  private bloqueado: boolean;

  constructor() {
    this.bloqueado = false;
  }

  clickMenu(nombreMenu: string) {
  }

  getBloqueado() {
    return this.bloqueado;
  }

  getMenus() {
    return schDobleMenus.getMenus();
  }

  setBloqueado(x: boolean) {
    this.bloqueado = x;
  }

  insertarMenus(arrayMenus) {
    if (arrayMenus.length <= 0) return [];
    return schDobleMenus.insertarMenus(arrayMenus).then((res) => {
      return res.acknowledged;
    }).catch((err) => {
      logger.Error(70, err);
      return false;
    });
  }
}

export const dobleMenusInstance = new DobleMenusClase();
