import { CestasInterface } from "src/cestas/cestas.interface";

export interface TransaccionesInterface {
    _id: string,
    cesta: CestasInterface,
    total: number,
    idCliente: string
}