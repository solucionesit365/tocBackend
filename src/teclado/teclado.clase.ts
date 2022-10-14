import axios from "axios";
import { menusInstance } from "../menus/menus.clase";
import { articulosInstance } from "../articulos/articulos.clase";
import { parametrosInstance } from "../parametros/parametros.clase";
import { promocionesInstance } from "../promociones/promociones.clase";
import * as schTeclas from "./teclado.mongodb";
import { logger } from "../logger";
import { TeclasInterface } from "./teclado.interface";

export class TecladoClase {
  /* Eze 4.0 */
  insertarTeclas = async (arrayTeclas: TeclasInterface[]) => await schTeclas.insertarTeclas(arrayTeclas);

  /* Eze v23 */
  async actualizarTeclado(): Promise<boolean> {
    try {
      const parametros = await parametrosInstance.getParametros();
      const res: any = await axios.post(
        "articulos/descargarArticulosEspeciales",
        {
          database: parametros.database,
          codigoCliente: parametros.codigoTienda,
        }
      );
      const resMenusSanPedro: any = await axios.post("menus/getMenus", {
        database: parametros.database,
        codigoTienda: parametros.codigoTienda,
      });
      const resMenus: any = await menusInstance.insertarMenus(
        resMenusSanPedro.data.info
      );
      const res2: any = await articulosInstance.insertarArticulos(
        res.data.info
      );

      const infoTeclados: any = await axios.post("/teclas/descargarTeclados", {
        database: parametros.database,
        licencia: parametros.codigoTienda,
      });
      if (await tecladoInstance.insertarTeclas(infoTeclados.data.info)) {
        const resPromociones: any = await axios.post(
          "promociones/getPromociones",
          {
            database: parametros.database,
            codigoTienda: parametros.codigoTienda,
          }
        );
        if (resPromociones.data.info.lenght > 0) return await promocionesInstance.insertarPromociones(resPromociones.data.info);
        return true;
      }
      return false;
    } catch (err) {
      logger.Error(103, err);
      return false;
    }
  }

  async cambiarPosTecla(idArticle, nuevaPos, nombreMenu) {
    return await schTeclas.cambiarPosTecla(idArticle, nuevaPos, nombreMenu);
  }

  tienePrefijoSubmenu(x: string) {
    if (x.startsWith("0")) return true;
    return false;
  }

  async generarTecladoCompleto() {
    const teclas = await schTeclas.getTeclas();
    console.log(teclas);
    // const menus = await menusInstance.getMenus();
    let menus = {};
    let submenus = {};

    for (let i = 0; i < teclas.length; i++) {
      if (this.tienePrefijoSubmenu(teclas[i].nomMenu)) {
        const prefijo = teclas[i].nomMenu.slice(0, 2);
        if (submenus[prefijo]) {
          submenus[prefijo].push({
            nomMenu: teclas[i].nomMenu.slice(3),
            idArticle: teclas[i].idArticle,
            nombreArticulo: teclas[i].nombreArticulo,
            pos: teclas[i].pos,
            color: teclas[i].color,
            esSumable: teclas[i].esSumable
          });
        } else {
          submenus[prefijo] = [];
          submenus[prefijo].push({
            nomMenu: teclas[i].nomMenu.slice(3),
            idArticle: teclas[i].idArticle,
            nombreArticulo: teclas[i].nombreArticulo,
            pos: teclas[i].pos,
            color: teclas[i].color,
            esSumable: teclas[i].esSumable
          });
        }
      } else {
        const nombreGrupo = teclas[i].nomMenu;
        if (menus[nombreGrupo]) {
          menus[nombreGrupo].push(teclas[i]);
        } else {
          menus[nombreGrupo] = [];
          menus[nombreGrupo].push(teclas[i]);
        }
      }
    }
    
    return {
      menusItems: menus,
      submenusItems: submenus
    };
  }
}
export const tecladoInstance = new TecladoClase();
