import {parametrosInstance} from './parametros/parametros.clase';

const escpos = require('escpos');
const exec = require('child_process').exec;
const os = require('os');
escpos.USB = require('escpos-usb');
escpos.Serial = require('escpos-serialport');
escpos.Screen = require('escpos-screen');

export class Dispositivos {
  async getDevice() {
    const parametros = await parametrosInstance.getEspecialParametros();
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
          console.log('Parametros de impresora no configurados');
          return null;
        }
      } catch (err) {
        console.log(err);
        return null;
      }
    } else if (os.platform() === 'win32') {
 
      try {
        if (parametros.tipoImpresora == 'USB') {
        
          // const device: number = new escpos.USB();
          console.log('OBSERVÁ: ', parametros.impresoraUsbInfo.vid.toUpperCase(), parametros.impresoraUsbInfo.pid.toUpperCase());
          const device: number = new escpos.USB(parametros.impresoraUsbInfo.vid.toUpperCase(), parametros.impresoraUsbInfo.pid.toUpperCase());
          console.log(device);
          return device;
        } else if (parametros.tipoImpresora == 'SERIE') {
          const device = new escpos.Serial('COM1', {
            baudRate: 115200,
            stopBit: 2,
          });
          return device;
        } else {
          console.log('Parametros de impresora no configurados');
          return null;
        }
      } catch (err) {
        console.log(err.message);
        return null;
      }
    }
  }

  async getDeviceVisor() {
    const parametros = await parametrosInstance.getEspecialParametros();
    if (parametros.visor != undefined) {
      if(parametros.visor == 'MQTT'){
        return 'MQTT'
      }
      if (parametros.visor.includes('COM') || parametros.visor == 'SI' ) {
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

