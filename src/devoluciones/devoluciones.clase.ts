import {impresoraInstance} from 'src/impresora/impresora.class';
import {cestas} from '../cestas/cestas.clase';
import {DevolucionesInterface} from './devoluciones.interface';
import * as schDevoluciones from './devoluciones.mongodb';

export class Devoluciones {
  private bloqueado = false;

  async nuevaDevolucion(total: number, idCesta: number, idTrabajador: number): Promise<boolean> {
    if (this.bloqueado == false) {
      this.bloqueado = true;
      const nuevoIdTicket = Date.now();
      const cesta = await cestas.getCesta(idCesta);

      if (cesta == null || cesta.lista.length == 0) {
        this.bloqueado = false;
        return false;
      }
      const objDevolucion: DevolucionesInterface = {
        _id: nuevoIdTicket,
        timestamp: Date.now(),
        total: total,
        lista: cesta.lista,
        tipoPago: "DEVOLUCION",
        idTrabajador: idTrabajador,
        tiposIva: cesta.tiposIva,
        enviado: false,
        enTransito: false,
        intentos: 0,
        comentario: '',
      };
      if (await this.insertarDevolucion(objDevolucion)) {
        impresoraInstance.imprimirTicket(nuevoIdTicket, true);
        this.bloqueado = false;
        return await cestas.borrarCesta(idCesta);
      } else {
        this.bloqueado = false;
        return false;
      }
    } else {
      return false;
    }
  }

  getDevolucionMasAntigua() {
    return schDevoluciones.getDevolucionMasAntigua();
  }

  actualizarEstadoDevolucion(devolucion: DevolucionesInterface) {
    return schDevoluciones.actualizarEstadoDevolucion(devolucion).then((res) => {
      return res.acknowledged;
    }).catch((err) => {
      console.log(err);
      return false;
    });
  }

  private insertarDevolucion(data: DevolucionesInterface): Promise<boolean> {
    return schDevoluciones.insertarDevolucion(data).then((res) => {
      return res.acknowledged;
    }).catch((err) => {
      console.log(err);
      return false;
    });
  }

  getDevolucionByID(id: number) {
    return schDevoluciones.getDevolucionByID(id);
  }
}
export const devolucionesInstance = new Devoluciones();
