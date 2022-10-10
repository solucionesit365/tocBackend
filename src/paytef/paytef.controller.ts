import { Controller, Get } from "@nestjs/common";
import { paytefInstance } from "./paytef.class";
import { logger } from "../logger";

const exec = require("child_process").exec;

@Controller("paytef")
export class PaytefController {
  @Get("cancelarOperacionActual")
  async cancelarOperacionActual() {
    try {
      return await paytefInstance.cancelarOperacionActual();
    } catch (err) {
      logger.Error(48, err);
      return false;
    }
  }

  @Get("scanDevices")
  buscarDispositivos() {
    exec("arp -a", (err, stdout, stderr) => {
      if (err) {
        logger.Error(49, err);
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
