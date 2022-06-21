/// <reference types="node" />
import { CestasInterface } from "src/cestas/cestas.interface";
import { Socket } from 'dgram';
declare class PaytefClass {
    getTotal(cesta: CestasInterface): number;
    iniciarTransaccion(client: Socket, idCliente: string, idCesta: number): Promise<void>;
    consultarEstadoOperacion(client: Socket): Promise<void>;
    cerrarTicket(): Promise<{
        error: boolean;
        mensaje?: undefined;
    } | {
        error: boolean;
        mensaje: string;
    }>;
}
declare const paytefInstance: PaytefClass;
export { paytefInstance };
