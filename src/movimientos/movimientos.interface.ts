export interface MovimientosInterface {
    _id: number,
    tipo: TiposMovientos,
    valor: number,
    concepto: string,
    idTrabajador: number,
    codigoBarras: string,
    idTicket: number,
    enviado: boolean,
    enTransito: boolean,
    comentario: string,
    intentos: number
}

export type TiposMovientos = "EFECTIVO" | "TARJETA" | "TKRS_CON_EXCESO" | "TKRS_SIN_EXCESO" | "DEUDA" | "CONSUMO_PERSONAL";