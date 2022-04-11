// 100%
import { ParametrosInterface } from "./parametros.interface";
import * as schParametros from "./parametros.mongodb";
import * as schTickets from "../tickets/tickets.mongodb";

const TIPO_USB = 'USB';
const TIPO_SERIE = 'SERIE';
const TIPO_CLEARONE = 'CLEARONE';
const TIPO_3G = '3G';
const TIPO_ENTRADA = 'ENTRADA';
const TIPO_SALIDA = 'SALIDA';
const parametrosVacios: ParametrosInterface = {
    _id: '',
    licencia: 0,
    codigoTienda: 0,
    database: '',
    nombreEmpresa: '',
    nombreTienda: '',
    tipoImpresora: TIPO_USB,
    tipoDatafono: TIPO_CLEARONE,
    impresoraCafeteria: 'NO',
    clearOneCliente: 0,
    clearOneTienda: 0,
    clearOneTpv: 0,
    botonesConPrecios: 'No',
    prohibirBuscarArticulos: 'No',
    ultimoTicket: -1,
    idCurrentTrabajador: -1,
    impresoraUsbInfo: { vid: '', pid: '' },
    token: undefined

};

 export class ParametrosClase {
    private parametros: ParametrosInterface;

    constructor() {
        schParametros.getParametros().then((infoParams: ParametrosInterface) => {
            if (infoParams != null) {
                schTickets.getUltimoTicket().then((ultimoIDTicket) => {
                    infoParams.ultimoTicket = ultimoIDTicket;
                    this.parametros = infoParams;
                }).catch((err) => {
                    console.log(err);
                });
            } else {
                this.parametros = parametrosVacios;
            }
        }).catch((err) => {
            console.log(err);
            this.parametros = parametrosVacios;
        });
    }

    getParametros(): ParametrosInterface {
        return this.parametros;
    }

    getEspecialParametros(): Promise <ParametrosInterface | null> {
        return schParametros.getParametros().then((infoParams: ParametrosInterface) => {
            return infoParams;
        }).catch((err) => {
            console.log(err);
            return null;
        });
    }

    setParametros(params: ParametrosInterface): Promise<boolean> {
        // this.parametros.licencia = params.licencia;
        // this.parametros.tipoImpresora = params.tipoImpresora;
        // this.parametros.tipoDatafono = params.tipoDatafono;
        // this.parametros.impresoraCafeteria = params.impresoraCafeteria;
        // this.parametros.ultimoTicket = params.ultimoTicket;
        this.parametros = params;
        return schParametros.setParametros(this.parametros).then((res) => {
            return res.acknowledged;
        }).catch((err) => {
            console.log(err);
            return false;
        });
    }

    todoInstalado(): boolean {
        const params = this.getParametros();
        if (params._id === '' || params.licencia === 0 || params.codigoTienda === 0) {
            return false;
        } else {
            return true;
        }
    }

    checkParametrosOK(params: ParametrosInterface) {
        if (params.licencia > 0 && params.codigoTienda > 0 && params.database.length > 0 && params.nombreEmpresa.length > 0 && params.nombreTienda.length > 0 && params.tipoImpresora.length > 0 && params.tipoDatafono.length > 0) {
            return true;
        }
    }

    actualizarParametros() {
        schParametros.getParametros().then((infoParams: ParametrosInterface) => {
            if (infoParams != null) {
                this.parametros = infoParams;
            } else {
                this.parametros = parametrosVacios;
            }
        }).catch((err) => {
            console.log(err);
            this.parametros = parametrosVacios;
        });
    }

    setUltimoTicket(idTicket: number) {
        return schParametros.setUltimoTicket(idTicket).then((res) => {
            if (res.acknowledged) {
                return true;
            } else {
                return false;
            }
        }).catch((err) => {
            console.log(err);
            return false;
        });
    }

    setVidAndPid(vid: string, pid: string) {
        return schParametros.setVidAndPid(vid, pid).then((res) => {
            if (res.acknowledged) {
                return true;
            } else {
                return false;
            }
        }).catch((err) => {
            console.log(err);
            return false;
        });
    }

    setIpPaytef(ip: string) {
        return schParametros.setIpPaytef(ip).then((res) => {
            if (res.acknowledged) {
                return true;
            } else {
                return false;
            }
        }).catch((err) => {
            console.log(err);
            return false;
        });
    }

}

const parametrosInstance = new ParametrosClase();

export { parametrosInstance }