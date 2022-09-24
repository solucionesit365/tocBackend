import { ItemLista } from "../cestas/cestas.interface";

export interface TicketsInterface {
    _id: number,
    timestamp: number,
    total: number,
    lista: ItemLista[],
    idTrabajador: number,
    objIva: Iva,
    cliente: string,
    infoClienteVip: {
        esVip: boolean,
        nif: string,
        nombre: string,
        cp: string,
        direccion: string,
        ciudad: string
    },
    regalo: boolean,
    enviado: boolean,
}

export type Iva = {
    base1: number,
    base2: number,
    base3: number,
    valorIva1: number,
    valorIva2: number,
    valorIva3: number,
    importe1: number,
    importe2: number,
    importe3: number
}