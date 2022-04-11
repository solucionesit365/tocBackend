import { CestasInterface } from "src/cestas/cestas.interface";
declare class TransaccionesClass {
    crearTransaccion(cesta: CestasInterface, total: number, idCliente: string): Promise<any>;
    getTransaccionById(idTransaccion: string): Promise<any>;
    setPagada(idTransaccion: string): Promise<boolean | import("mongodb").UpdateResult>;
    getUltimaTransaccion(): Promise<any>;
}
export declare const transaccionesInstance: TransaccionesClass;
export {};
