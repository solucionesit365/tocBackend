import { Controller, Post, Body } from "@nestjs/common";
import { menusInstance } from "./menus.clase";

@Controller("menus")
export class MenusController {
  @Post("clickMenu")
  clickMenu(@Body() params) {
    if (menusInstance.getBloqueado() == false) {
      menusInstance.setBloqueado(true);
      return menusInstance
        .clickMenu(params.nombreMenu)
        .then((res) => {
          menusInstance.setBloqueado(false);
          return {
            bloqueado: false,
            resultado: res,
          };
        })
        .catch((err) => {
          menusInstance.setBloqueado(false);
          return {
            bloqueado: false,
            error: err,
          };
        });
    } else {
      return {
        bloqueado: true,
      };
    }
  }

  /* Eze 4.0 */
  @Post("getMenus")
  async getMenus() {
    try {
      return await menusInstance.getMenus();
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  @Post("getSubmenus")
  getSubmenus(@Body() params) {
    return menusInstance.getSubmenus(params.tag).then((res) => {
      if (!menusInstance.getBloqueado())
        return { bloqueado: false, resultado: res };
      return { bloqueado: true };
    });
  }
}
