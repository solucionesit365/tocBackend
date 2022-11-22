import { Controller, Post, Body } from "@nestjs/common";
import axios from "axios";
import { parametrosInstance } from "../parametros/parametros.clase";
import { trabajadoresInstance } from "src/trabajadores/trabajadores.clase";
import { articulosInstance } from "src/articulos/articulos.clase";
import { clienteInstance } from "src/clientes/clientes.clase";
import { familiasInstance } from "src/familias/familias.class";
import { nuevaInstancePromociones } from "src/promociones/promociones.clase";
import { paramsTicketInstance } from "src/params-ticket/params-ticket.class";
import { menusInstance } from "src/menus/menus.clase";
import { tecladoInstance } from "src/teclado/teclado.clase";
import { dobleMenusInstance } from "src/doble-menus/doble-menus.clase";
import { logger } from "../logger";

@Controller("instalador")
export class InstaladorController {
  /* Eze 4.0 */
  @Post("pedirDatos")
  async instalador(
    @Body()
    { password, numLlicencia, tipoImpresora, tipoDatafono, impresoraCafeteria }
  ) {
    try {
      if (
        password &&
        numLlicencia &&
        tipoImpresora &&
        tipoDatafono &&
        impresoraCafeteria
      ) {
        const resAuth: any = await axios.post("parametros/instaladorLicencia", {
          password,
          numLlicencia,
        });

        if (resAuth.data) {
          const objParams = parametrosInstance.generarObjetoParametros();

          objParams.licencia = numLlicencia;
          objParams.tipoImpresora = tipoImpresora;
          objParams.tipoDatafono = tipoDatafono;
          objParams.impresoraCafeteria = impresoraCafeteria;
          objParams.ultimoTicket = resAuth.data.ultimoTicket;
          objParams.codigoTienda = resAuth.data.codigoTienda;
          objParams.nombreEmpresa = resAuth.data.nombreEmpresa;
          objParams.nombreTienda = resAuth.data.nombreTienda;
          objParams.token = resAuth.data.token;
          objParams.database = resAuth.data.database;
          objParams.visor = "";
          objParams.impresoraUsbInfo = {
            pid: "",
            vid: "",
          };

          return await parametrosInstance.setParametros(objParams);
        }
        throw Error("Error: San Pedro no puede autentificar esta petición");
      }
      throw Error("Faltan datos en instalador/pedirDatos controller");
    } catch (err) {
      logger.Error(93, err);
    }
  }

  /* Eze 4.0 */
  @Post("descargarTodo")
  async descargarTodo() {
    try {
      const parametros = await parametrosInstance.getParametros();
      const res: any = await axios.post("datos/cargarTodo", {
        database: parametros.database,
        codigoTienda: parametros.codigoTienda,
        licencia: parametros.licencia,
      });

      if (res.data) {
        const info1 = await trabajadoresInstance.insertarTrabajadores(
          res.data.dependientas
        );
        const info2 = await articulosInstance.insertarArticulos(
          res.data.articulos
        );
        const info3 = await clienteInstance.insertarClientes(
          res.data.clientes
        );
        const info4 = await familiasInstance.insertarFamilias(
          res.data.familias
        );
        const info5 = await nuevaInstancePromociones.insertarPromociones(
          res.data.promociones
        );
        const info6 = await paramsTicketInstance.insertarParametrosTicket(
          res.data.parametrosTicket
        );
        const info7 = await menusInstance.insertarMenus(res.data.menus);
        const info8 = await tecladoInstance.insertarTeclas(
          res.data.teclas
        );
        const info9 = true; // await cestas.insertarCestas(res.data.info.cestas);
        const info10 = await dobleMenusInstance.insertarMenus(
          res.data.dobleMenus
        );
        if (
          info1 &&
          info2 &&
          info3 &&
          info4 &&
          info5 &&
          info6 &&
          info7 &&
          info8 &&
          info9 &&
          info10
        ) {
          return true;
        }
        throw Error(
          `Backend: res1: ${info1}, res2: ${info2}, res3: ${info3}, res4: ${info4}, res5: ${info5}, res6: ${info6}, res7: ${info7}, res8: ${info8}`
        );
      }
      throw Error("Error de autenticación en SanPedro");
    } catch (err) {
      logger.Error(95, err);
      return false;
    }
  }
}
