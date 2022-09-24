import { CestasInterface } from "../cestas/cestas.interface";

export interface TicketsInterface {
    _id: number,
    timestamp: number,
    total: number,
    cesta: CestasInterface,
    idTrabajador: number,
    cliente: {
        id: string,
        esVip: boolean,
        nif: string,
        nombre: string,
        cp: string,
        direccion: string,
        ciudad: string
    },
    enviado: boolean,
}
