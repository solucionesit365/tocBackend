import { Body, Controller, Post, Get } from "@nestjs/common";
import { parametrosInstance } from "./parametros.clase";
import axios from "axios";
import { UtilesModule } from "../utiles/utiles.module";
import { logger } from "../logger";

@Controller("parametros")
export class ParametrosController {
  /* Eze 4.0 */
  @Get("todoInstalado")
  async todoInstalado() {
    try {
      return await parametrosInstance.todoInstalado();
    } catch (err) {
      logger.Error(40, err);
      return false;
    }
  }

  /* Eze 4.0 */
  @Post("getParametros")
  async getParametros() {
    try {
      return await parametrosInstance.getParametros();
    } catch (err) {
      logger.Error(41, err);
      return null;
    }
  }

  /* Eze 4.0 */
  @Post("setPropiedad")
  async setPropiedad(@Body() { parametros }) {
    try {
      if (parametros) {
        return await parametrosInstance.setPropiedad(parametros);
      } 

      throw Error("Faltan datos en parametros/setPropiedad");
    } catch (err) {
      logger.Error("parametros.controller.ts @setPropiedad");
      return false;
    }
  }

  /* Eze 4.0 */
  @Get("actualizarParametros")
  async actualizarParametros() {
    try {
      const res: any = await axios.get("parametros/getParametros");

      if (res.data) {
        delete res.data.database;
        delete res.data.ultimoTicket;
        delete res.data.tipoImpresora;
        delete res.data.tipoDatafono;
        delete res.data.token;
        delete res.data.licencia;
        delete res.data.impresoraUsbInfo;
        console.log(res.data);
        return await parametrosInstance.setParametros(res.data);
      }

      return false;
    } catch (err) {
      logger.Error(42, err);
      return false;
    }
  }

  /* Eze 4.0 */
  @Post("setVidAndPid")
  async vidAndPid(@Body() { vid, pid }) {
    try {
      if (vid && pid && vid != "" && pid != "")
        return await parametrosInstance.setVidAndPid(vid, pid);
      throw Error("Error, faltan datos en setVidAndPid() controller");
    } catch (err) {
      logger.Error(43, err);
      return false;
    }
  }

  /* Eze 4.0 */
  @Post("setTipoImpresora")
  async setTipoImpresora(@Body() { tipo }) {
    try {
      if (tipo && tipo != "") {
        return await parametrosInstance.setTipoImpresora(tipo);
      }
      throw Error("Faltan datos en parametros/setTipoImpresora");
    } catch (err) {
      logger.Error(143, err);
      return false;
    }
  }

  /* Eze 4.0 */
  @Get("getVidAndPid")
  async getVidAndPid() {
    try {
      return (await parametrosInstance.getParametros()).impresoraUsbInfo;
    } catch (err) {
      logger.Error(44, err);
      return null;
    }
  }

  /* Eze 4.0 */
  @Post("setIpPaytef")
  async setIpPaytef(@Body() { ip }) {
    try {
      if (UtilesModule.checkVariable(ip))
        return await parametrosInstance.setIpPaytef(ip);
      throw Error("Error, faltan datos en setIpPaytef() controller");
    } catch (err) {
      logger.Error(45, err);
      return false;
    }
  }

  /* Eze 4.0 */
  @Get("getIpPaytef")
  async getIpPaytef() {
    try {
      return (await parametrosInstance.getParametros()).ipTefpay;
    } catch (err) {
      logger.Error(46, err);
      return null;
    }
  }
}
