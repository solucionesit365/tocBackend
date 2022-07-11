/// <reference types="node" />
import { TicketsInterface } from "src/tickets/tickets.interface";
import { CestasInterface } from "src/cestas/cestas.interface";
import { Socket } from 'dgram';
import { Respuesta } from "./paytef.interface";
declare class PaytefClass {
    getTotal(cesta: CestasInterface): number;
    cancelarOperacion(): void;
    iniciarDatafono(idTicket: number, total: number, client: Socket): void;
    iniciarTransaccion(client: Socket, idCliente: string, idCesta: number): Promise<void>;
    anularOperacion(idTicket: number, client: Socket): void;
    consultarEstadoOperacion(client: Socket, idTicket: number): Promise<void>;
    cerrarTicket(nuevoTicket: TicketsInterface): Promise<Respuesta>;
}
declare const paytefInstance: PaytefClass;
export { paytefInstance };
