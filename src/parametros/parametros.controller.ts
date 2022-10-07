import { Body, Controller, Post, Get, ConsoleLogger } from "@nestjs/common";
import { parametrosInstance } from "./parametros.clase"
import axios from "axios";
import { UtilesModule } from "src/utiles/utiles.module";
import { logger } from "../logger";

@Controller("parametros")
export class ParametrosController {

  /* Eze 4.0 */
  @Post("todoInstalado")
  async todoInstalado() {
    try {
      return await parametrosInstance.todoInstalado();
    } catch (err) {
      logger.Error(err);
      return false;
    }
  }

  /* Eze 4.0 */
  @Post("getParametros")
  async getParametros() {
    try {
      return await parametrosInstance.getParametros();
    } catch (err) {
      logger.Error(err);
      return null;
    }
  }

  /* Eze 4.0 */
  @Post("actualizarParametros")
  async actualizarParametros() {
    try {
      const licencia = (await parametrosInstance.getParametros()).licencia;

      const res: any = await axios.post("parametros/getParametros", {
        numLlicencia: licencia,
      });

      if (!res.data.error) {
        const paramstpv = res.data.info;
        return await parametrosInstance.setParametros(paramstpv);
      }
      return false;
    } catch (err) {
      logger.Error(err);
      return false;
    }
  }

  /* Eze 4.0 */
  @Post("setVidAndPid")
  async vidAndPid(@Body() { vid, pid, com }) {
    try {
      if (UtilesModule.checkVariable(vid, pid, com))
      return await parametrosInstance.setVidAndPid(
        vid,
        pid,
        com
      );
      throw Error("Error, faltan datos en setVidAndPid() controller");
    } catch (err) {
      logger.Error(err);
      return false;
    }
  }

  /* Eze 4.0 */
  @Get("getVidAndPid")
  async getVidAndPid() {
    try {
      return (await parametrosInstance.getParametros()).impresoraUsbInfo;
    } catch (err) {
      logger.Error(err);
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
      console.log(err);
      return false;
    }
  }

  /* Eze 4.0 */
  @Get("getIpPaytef")
  async getIpPaytef() {
    try {
      return (await parametrosInstance.getParametros()).ipTefpay;
    } catch (err) {
      logger.Error(err);
      return null;
    }
  }
}
