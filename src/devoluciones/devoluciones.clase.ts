import { ObjectId } from "mongodb";
import { CestasInterface } from "../cestas/cestas.interface";
import { impresoraInstance } from "../impresora/impresora.class";
import { cestasInstance } from "../cestas/cestas.clase";
import { DevolucionesInterface } from "./devoluciones.interface";
import * as schDevoluciones from "./devoluciones.mongodb";

export class Devoluciones {
  /* Eze 4.0 */
  async nuevaDevolucion(
    total: number,
    idCesta: CestasInterface["_id"],
    idTrabajador: number
  ): Promise<boolean> {
    const nuevoIdTicket = Date.now();
    const cesta = await cestasInstance.getCestaById(idCesta);

    if (cesta == null || cesta.lista.length == 0)
      throw Error("Error, cesta rota en nuevaDevolucion() class");

    const objDevolucion: DevolucionesInterface = {
      _id: new ObjectId(),
      timestamp: Date.now(),
      total: total,
      cesta,
      idTrabajador,
      enviado: false,
      cliente: null,
    };
    await this.insertarDevolucion(objDevolucion);
    await impresoraInstance.imprimirTicket(nuevoIdTicket, true);
    return await cestasInstance.deleteCesta(cesta._id);
  }

  /* Eze 4.0 */
  getDevolucionMasAntigua = async () =>
    await schDevoluciones.getDevolucionMasAntigua();

  /* Eze 4.0 */
  actualizarEstadoDevolucion = async (devolucion: DevolucionesInterface) =>
    await schDevoluciones.actualizarEstadoDevolucion(devolucion);

  /* Eze 4.0 */
  private insertarDevolucion = async (
    devolucion: DevolucionesInterface
  ): Promise<boolean> => await schDevoluciones.insertarDevolucion(devolucion);

  /* Eze 4.0 */
  getDevolucionByID = async (id: ObjectId) =>
    await schDevoluciones.getDevolucionByID(id);
}
export const devolucionesInstance = new Devoluciones();
