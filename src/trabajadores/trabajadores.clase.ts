import {
  SincroFichajesInterface,
  TrabajadoresInterface,
  TiposSincroFichaje,
} from "./trabajadores.interface";
import * as schTrabajadores from "./trabajadores.mongodb";
import { parametrosInstance } from "../parametros/parametros.clase";
import axios from "axios";
import { cestas } from "../cestas/cestas.clase";

export class TrabajadoresClase {

  /* Eze v23 */
  getTrabajadorById(idTrabajador: number) {
    return schTrabajadores.getTrabajador(idTrabajador);
  }

  /* Eze v23 */
  buscar(busqueda: string) {
    return schTrabajadores.buscar(busqueda);
  }

  /* Eze v23 */
  mantenerTrabajadoresFichados(nuevoArray: TrabajadoresInterface[]): Promise<TrabajadoresInterface[]> {
    return this.getFichados()
      .then((arrayFichados) => {
        for (let i = 0; i < arrayFichados.length; i++) {
          for (let j = 0; j < nuevoArray.length; j++) {
            if (arrayFichados[i]._id == nuevoArray[j]._id) {
              nuevoArray[j]["fichado"] = true;
              break;
            }
          }
        }
        return nuevoArray;
      })
      .catch((err) => {
        console.log(err);
        return [];
      });
  }

  /* Eze v23 */
  async actualizarTrabajadores(): Promise<boolean> {
    try {
      const params = await parametrosInstance.getParametros();
      const res: any = await axios.post("dependientas/descargar", { database: params.database });
      if (!res.data.error && res.data.info.length > 0) {
        const resKeep = await this.mantenerTrabajadoresFichados(res.data.info);
        if (resKeep.length > 0) {
          return await this.insertarTrabajadores(resKeep);
        } else {
          return true;
        }
      }
      return false;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  /* Eze v23 */
  getTrabajadoresFichados(): Promise<TrabajadoresInterface[]> {
    return schTrabajadores.getTrabajadoresFichados();
  }

  /* Eze v23 */
  async ficharTrabajador(idTrabajador: number): Promise<boolean> {
    try {
      const nuevaCesta = await cestas.crearNuevaCesta();
      if (await schTrabajadores.ficharTrabajador(idTrabajador, nuevaCesta._id)) {
        return await this.nuevoFichajesSincro("ENTRADA", idTrabajador);
      } else {
        throw Error("No se ha podido fichar al trabajador");
      }
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  /* Eze v23 */
  async desficharTrabajador(idTrabajador: number): Promise<boolean> {
    try {
      if (await schTrabajadores.desficharTrabajador(idTrabajador)) {
        if (await this.nuevoFichajesSincro("SALIDA", idTrabajador)) {
          return await cestas.eliminarCesta(idTrabajador);
        } else {
          throw Error("No se ha podido insertar la salida en el sincro");
        }
      } else {
        throw Error("No se ha podido desfichar al trabajador");
      }
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  /* Eze v23 */
  async inicioDescanso(idTrabajador: number): Promise<boolean> {
    try {
      if (await schTrabajadores.inicioDescanso(idTrabajador)) {
        if (await this.nuevoFichajesSincro("DESCANSO", idTrabajador)) {
          return await cestas.borrarCestaDelTrabajador(idTrabajador);
        } else {
          throw Error("No se ha podido insertar el descanso en el sincro");
        }
      } else {
        throw Error("No se ha podido iniciar el descanso");
      }
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  /* Eze v23 */
  async finDescanso(idTrabajador: number): Promise<boolean> {
    try {
      const nuevaCesta = await cestas.crearNuevaCesta();
      if (nuevaCesta) {
        if (
          await schTrabajadores.ficharTrabajador(idTrabajador, nuevaCesta._id)
        ) {
          return await this.nuevoFichajesSincro("FINDESCANSO", idTrabajador);
        } else {
          throw Error("No se ha podido fichar al trabajador");
        }
      } else {
        throw Error("No se ha podido crear la cesta");
      }
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  /* Eze v23 */
  async nuevoFichajesSincro(
    tipo: TiposSincroFichaje,
    idTrabajador: number
  ): Promise<boolean> {
    try {
      const auxTime = new Date();
      const objGuardar: SincroFichajesInterface = {
        _id: Date.now(),
        infoFichaje: {
          idTrabajador: idTrabajador,
          fecha: {
            year: auxTime.getFullYear(),
            month: auxTime.getMonth(),
            day: auxTime.getDate(),
            hours: auxTime.getHours(),
            minutes: auxTime.getMinutes(),
            seconds: auxTime.getSeconds(),
          },
        },
        tipo: tipo,
        enviado: false,
      };
      return await schTrabajadores.insertNuevoFichaje(objGuardar);
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  /* Eze v23 */
  getFichados(): Promise<TrabajadoresInterface[]> {
    return schTrabajadores.buscarTrabajadoresFichados();
  }

  /* Eze v23 */
  insertarTrabajadores(
    arrayTrabajadores: TrabajadoresInterface[]
  ): Promise<boolean> {
    return schTrabajadores.insertarTrabajadores(arrayTrabajadores);
  }

  /* Eze v23 */
  getFichajeMasAntiguo(): Promise<SincroFichajesInterface> {
    return schTrabajadores.getFichajeMasAntiguo();
  }

  /* Eze v23 */
  actualizarEstadoFichaje(fichaje: SincroFichajesInterface): Promise<boolean> {
    return schTrabajadores.actualizarEstadoFichaje(fichaje);
  }
}

export const trabajadoresInstance = new TrabajadoresClase();
