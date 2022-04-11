import { conexion } from "../conexion/mongodb";
import { ParametrosInterface } from "./parametros.interface";

export async function getParametros() {
    const database = (await conexion).db('tocgame');
    const parametros = database.collection('parametros');
    const resultado = await parametros.findOne({_id: "PARAMETROS"});
    
    return resultado;
}
// codigoTienda: number,
// database: string,
// licencia: number,
// nombreEmpresa: string,
// nombreTienda: string,
// tipoDatafono: string,
// tipoImpresora: string,
// impresoraCafeteria: string,
// clearOneCliente?: number,
// clearOneTienda?: number,
// clearOneTpv?: number,
// botonesConPrecios: string,
// prohibirBuscarArticulos: string,
// ultimoTicket: number,
// idCurrentTrabajador: number,
// token: string
export async function setParametros(params: ParametrosInterface) {
    const database = (await conexion).db('tocgame');
    const parametros = database.collection('parametros');
    const resultado = await parametros.updateOne({_id: "PARAMETROS"}, {$set: {
        "codigoTienda": params.codigoTienda,
        "database": params.database,
        "licencia": params.licencia,
        "nombreEmpresa": params.nombreEmpresa,
        "nombreTienda": params.nombreTienda,
        "tipoDatafono": params.tipoDatafono,
        "tipoImpresora": params.tipoImpresora,
        "impresoraCafeteria": params.impresoraCafeteria,
        "botonesConPrecios": params.botonesConPrecios,
        "prohibirBuscarArticulos": params.prohibirBuscarArticulos,
        "ultimoTicket": params.ultimoTicket,
        "idCurrentTrabajador": params.idCurrentTrabajador,
        "impresoraUsbInfo": params.impresoraUsbInfo,
        "token": params.token
    }}, {upsert: true});
    
    return resultado;
}

export async function setUltimoTicket(idTicket: number) {
    const database = (await conexion).db('tocgame');
    const parametros = database.collection('parametros');
    const resultado = await parametros.updateOne({_id: "PARAMETROS"}, {$set: {"ultimoTicket": idTicket}}, {upsert: true});
    
    return resultado;
}

export async function setVidAndPid(vid: string, pid: string) {
    const database = (await conexion).db('tocgame');
    const parametros = database.collection('parametros');
    const resultado = await parametros.updateOne({_id: "PARAMETROS"}, {$set: {"impresoraUsbInfo": { vid: vid, pid: pid }}}, {upsert: true});
    
    return resultado;
}

export async function setIpPaytef(ip: string) {
    const database = (await conexion).db('tocgame');
    const parametros = database.collection('parametros');
    const resultado = await parametros.updateOne({_id: "PARAMETROS"}, {$set: {"ipTefpay": ip}}, {upsert: true});
    return resultado;
}