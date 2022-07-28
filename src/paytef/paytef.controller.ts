import {Body, Controller, Get, Post} from '@nestjs/common';
import axios from 'axios';
import {Console} from 'console';
import {LogsClass} from 'src/logs/logs.class';
import {transaccionesInstance} from 'src/transacciones/transacciones.class';
import {TransaccionesInterface} from 'src/transacciones/transacciones.interface';
import {UtilesModule} from 'src/utiles/utiles.module';
import {parametrosInstance} from '../parametros/parametros.clase';
import {ticketsInstance} from '../tickets/tickets.clase';
import {paytefInstance} from './paytef.class';
// import find from 'local-devices'

const exec = require('child_process').exec;
const os = require('os');

@Controller('paytef')
export class PaytefController {
    @Get('cancelarOperacionActual')
  cancelarOperacionActual() {
    const ipDatafono = parametrosInstance.getParametros().ipTefpay;
    return axios.post(`http://${ipDatafono}:8887/pinpad/cancel`, {pinpad: '*'}).then((res: any) => {
      if (res.data.info.success === true) {
        return true;
      } else {
        return false;
      }
    }).catch((err) => {
      console.log(err);
      return false;
    });
  }

    @Get('scanDevices')
    buscarDispositivos() {
      exec('arp -a', (err, stdout, stderr) => {
        if (err) {
          console.log(err);
        } else {
          let ipTefpay = '';
          const arrayDevices: any = stdout.split(/\r?\n/);
          for (let i = 0; i < arrayDevices.length; i++) {
            if (arrayDevices[i].includes('A30')) {
              ipTefpay = arrayDevices[i].split(' ');
              break;
            }
          }
        }
      });
    }
}
