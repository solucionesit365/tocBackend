/// <reference types="node" />
import { CestasInterface } from "src/cestas/cestas.interface";
import { Socket } from 'dgram';
declare class PaytefClass {
    getTotal(cesta: CestasInterface): number;
    iniciarTransaccion(client: Socket, idCliente: string): Promise<void>;
    consultarEstadoOperacion(client: Socket): Promise<void>;
    cerrarTicket(idTransaccion: string, recibo: string): Promise<{
        error: boolean;
        mensaje: string;
    } | {
        error: boolean;
        mensaje?: undefined;
    }>;
}
declare const paytefInstance: PaytefClass;
export { paytefInstance };
