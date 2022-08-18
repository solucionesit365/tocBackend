// 100%
import { ParametrosInterface } from "./parametros.interface";
import * as schParametros from "./parametros.mongodb";

export class ParametrosClase {
  /* Eze v23 */
  getParametros(): Promise<ParametrosInterface> {
    return schParametros.getParametros();
  }

  /* Eze v23 */
  actParametros(params: ParametrosInterface) {
    return schParametros.setParametros(params);
  }

  /* Eze v23 */
  setParametros(params: ParametrosInterface): Promise<boolean> {
    return schParametros.setParametros(params);
  }

  /* Eze v23 */
  async todoInstalado(): Promise<boolean> {
    try {
      const params = await this.getParametros();
      if (params) {
        return this.checkParametrosOK(params);
      }
      return false;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  /* Eze v23 */
  checkParametrosOK(params: ParametrosInterface): boolean {
    if (
      params._id === "PARAMETROS" &&
      params.licencia > 0 &&
      params.codigoTienda > 0 &&
      params.database.length > 0 &&
      params.nombreEmpresa.length > 0 &&
      params.nombreTienda.length > 0 &&
      params.tipoImpresora.length > 0 &&
      params.tipoDatafono.length > 0
    ) {
      return true;
    }
    return false;
  }

  /* Eze v23 */
  actualizarParametros() {
    console.log("Lee el comentario");
    /*
      Esto antes actualizaba los parámetros del this.parametros de esta clase, pero
      a partir de ahora, actualizarParametros se refiere a descargar datos del San Pedro
      o Gestión de la Tienda y hará un set en mongodb del tpv.
     */
  }

  /* Eze v23 */
  setUltimoTicket(idTicket: number): Promise<boolean> {
    return schParametros.setUltimoTicket(idTicket);
  }

  /* Eze v23 */
  setVidAndPid(vid: string, pid: string, com: string): Promise<boolean> {
    return schParametros.setVidAndPid(vid, pid, com);
  }

  /* Eze v23 */
  setIpPaytef(ip: string): Promise<boolean> {
    return schParametros.setIpPaytef(ip);
  }

  generarObjetoParametros(): ParametrosInterface {
    return {
      _id: "PARAMETROS",
      licencia: 0,
      codigoTienda: 0,
      database: "",
      nombreEmpresa: "",
      nombreTienda: "",
      tipoImpresora: "USB",
      tipoDatafono: "PAYTEF",
      impresoraCafeteria: "NO",
      clearOneCliente: 0,
      clearOneTienda: 0,
      clearOneTpv: 0,
      botonesConPrecios: "No",
      prohibirBuscarArticulos: "No",
      ultimoTicket: -1,
      impresoraUsbInfo: { vid: "", pid: "" },
      token: undefined,
    }; 
  }
}

const parametrosInstance = new ParametrosClase();

export { parametrosInstance };
