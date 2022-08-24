import { ItemLista } from "../cestas/cestas.interface";

export interface TicketsInterface {
    _id: number,
    timestamp: number,
    total: number,
    lista: ItemLista[],
    tipoPago: TiposPago,
    idTrabajador: number,
    objIva: Iva,
    enviado: boolean,
    cliente?: string,
    infoClienteVip?: {
        esVip: boolean,
        nif: string,
        nombre: string,
        cp: string,
        direccion: string,
        ciudad: string
    },
    cantidadTkrs?: number,
    regalo?: boolean,
    recibo?: string,
    bloqueado: boolean
}

export type TiposPago = "EFECTIVO" | "TARJETA" | "TKRS" | "DEUDA" | "CONSUMO_PERSONAL";
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