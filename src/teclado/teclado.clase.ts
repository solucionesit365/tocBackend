import axios from "axios";
import { menusInstance } from "../menus/menus.clase";
import { articulosInstance } from "../articulos/articulos.clase";
import { parametrosInstance } from "../parametros/parametros.clase";
import { promocionesInstance } from "../promociones/promociones.clase";
import * as schTeclas from "./teclado.mongodb";
import { logger } from "../logger";

export class TecladoClase {
  insertarTeclas(arrayTeclas) {
    return schTeclas
      .insertarTeclas(arrayTeclas)
      .then((res) => {
        return res.acknowledged;
      })
      .catch((err) => {
        logger.Error(err);
        return false;
      });
  }

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
        return await promocionesInstance.insertarPromociones(resPromociones.data.info);
      }
      return false;
    } catch (err) {
      logger.Error(err);
      return false;
    }
  }

  async cambiarPosTecla(idArticle, nuevaPos, nombreMenu) {
    return await schTeclas.cambiarPosTecla(idArticle, nuevaPos, nombreMenu);
  }
}
export const tecladoInstance = new TecladoClase();
