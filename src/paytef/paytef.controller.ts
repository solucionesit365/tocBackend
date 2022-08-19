import { Controller, Get } from "@nestjs/common";
import axios from "axios";
import { parametrosInstance } from "../parametros/parametros.clase";
// import {UtilesModule} from "src/utiles/utiles.module";

const exec = require("child_process").exec;

@Controller("paytef")
export class PaytefController {
  @Get("cancelarOperacionActual")
  async cancelarOperacionActual() {
    const ipDatafono = (await parametrosInstance.getParametros()).ipTefpay;
    return axios
      .post(`http://${ipDatafono}:8887/pinpad/cancel`, { pinpad: "*" })
      .then((res: any) => {
        if (res.data.info.success === true) {
          return true;
        } else {
          return false;
        }
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  }

  @Get("scanDevices")
  buscarDispositivos() {
    exec("arp -a", (err, stdout, stderr) => {
      if (err) {
        console.log(err);
      } else {
        let ipTefpay = "";
        const arrayDevices: any = stdout.split(/\r?\n/);
        for (let i = 0; i < arrayDevices.length; i++) {
          if (arrayDevices[i].includes("A30")) {
            ipTefpay = arrayDevices[i].split(" ");
            break;
          }
        }
      }
    });
  }
}
