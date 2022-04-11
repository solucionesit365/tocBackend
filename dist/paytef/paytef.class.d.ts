/// <reference types="node" />
import { Socket } from 'dgram';
declare class PaytefClass {
    iniciarTransaccion(client: Socket, idCliente: string): Promise<void>;
    consultarEstadoOperacion(client: Socket): Promise<void>;
    cerrarTicket(idTransaccion: string): Promise<{
        error: boolean;
        mensaje: string;
    } | {
        error: boolean;
        mensaje?: undefined;
    }>;
}
declare const paytefInstance: PaytefClass;
export { paytefInstance };
