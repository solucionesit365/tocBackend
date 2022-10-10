import {parametrosInstance} from './parametros/parametros.clase';

const escpos = require('escpos');
const exec = require('child_process').exec;
const os = require('os');
escpos.USB = require('escpos-usb');
escpos.Serial = require('escpos-serialport');
escpos.Screen = require('escpos-screen');
import { logger } from "./logger";

export class Dispositivos {
  async getDevice() {
    const parametros = await parametrosInstance.getParametros();
    if (os.platform() === 'linux') {
      try {
        if (parametros.tipoImpresora == 'USB') {
          const device: number = new escpos.USB(parametros.impresoraUsbInfo.vid.toUpperCase(), parametros.impresoraUsbInfo.pid.toUpperCase());
          return device;
        } else if (parametros.tipoImpresora == 'SERIE') {
          const device = new escpos.Serial('/dev/ttyS0', {
            baudRate: 115200,
            stopBit: 2,
          });
          return device;
        } else {
          logger.Info('Parametros de impresora no configurados');
          return null;
        }
      } catch (err) {
        logger.Error(34, err);
        return null;
      }
    } else if (os.platform() === 'win32') {
      try {
        if (parametros.tipoImpresora == 'USB') {
          const device: number = new escpos.USB(parametros.impresoraUsbInfo.vid.toUpperCase(), parametros.impresoraUsbInfo.pid.toUpperCase());
          return device;
        } else if (parametros.tipoImpresora == 'SERIE') {
          const device = new escpos.Serial('COM1', {
            baudRate: 115200,
            stopBit: 2,
          });
          return device;
        } else {
          logger.Info('Parametros de impresora no configurados');
          return null;
        }
      } catch (err) {
        logger.Error(35, err.message);
        return null;
      }
    }
  }

  async getDeviceVisor() {
    const parametros = await parametrosInstance.getParametros();
    if (parametros.visor != undefined) {
      if (parametros.visor.includes('COM') || parametros.visor == 'SI') {
        if (os.platform() === 'win32') {
          const device = new escpos.Serial(parametros.visor, {
            baudRate: 9600,
            stopBit: 2,
          });
          return device;
        } else if (os.platform() === 'linux') {
          return new escpos.Serial('/dev/ttyUSB0', {
            baudRate: 9600,
            // baudRate: 115200,
            stopBit: 2,
          });
        }
      }
      return null;
    }
  }
}

