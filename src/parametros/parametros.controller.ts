import { Body, Controller, Post, Get, ConsoleLogger } from "@nestjs/common";
import { parametrosInstance } from "./parametros.clase"
import axios from "axios";
import { UtilesModule } from "src/utiles/utiles.module";

@Controller("parametros")
export class ParametrosController {

  /* Eze v23 */
  @Post("todoInstalado")
  todoInstalado() {
    return parametrosInstance.todoInstalado();
  }

  /* Eze v23 */
  @Post("getParametros")
  getParametros() {
    return parametrosInstance.getParametros();
  }

  /* Eze v23 */
  @Post("actualizarParametros")
  async actualizarParametros() {
    try {
      const licencia = (await parametrosInstance.getParametros()).licencia;

      const res: any = await axios.post("parametros/getParametros", {
        numLlicencia: licencia,
      });

      if (!res.data.error) {
        const paramstpv = res.data.info;
        return parametrosInstance.setParametros(paramstpv);
      }
      return false;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  /* Eze v23 */
  @Post("vidAndPid")
  vidAndPid(@Body() params) {
    if (UtilesModule.checkVariable(params.vid, params.pid, params.com))
      return parametrosInstance.setVidAndPid(
        params.vid,
        params.pid,
        params.com
      );

    return false;
  }

  /* Eze v23 */
  @Get("getVidAndPid")
  async getVidAndPid() {
    return (await parametrosInstance.getParametros()).impresoraUsbInfo;
  }

  /* Eze v23 */
  @Post("setIpPaytef")
  setIpPaytef(@Body() params) {
    if (UtilesModule.checkVariable(params.ip))
      return parametrosInstance.setIpPaytef(params.ip);

    return false;
  }

  /* Eze v23 */
  @Get("getIpPaytef")
  async getIpPaytef() {
    return (await parametrosInstance.getParametros()).ipTefpay;
  }
}
