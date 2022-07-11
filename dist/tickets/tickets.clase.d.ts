import { TicketsInterface } from "./tickets.interface";
import { CestasInterface } from "src/cestas/cestas.interface";
export declare class TicketsClase {
    generarObjetoTicket(idTicket: number, total: number, cesta: CestasInterface, tipoPago: string, idCurrentTrabajador: number, idCliente: string): TicketsInterface;
    getTicketByID(idTicket: number): Promise<TicketsInterface>;
    rectificativa(idTicket: any): Promise<boolean>;
    getTicketsIntervalo(fechaInicio: number, fechaFinal: number): Promise<TicketsInterface[]>;
    getUltimoTicket(): Promise<number>;
    insertarTicket(ticket: TicketsInterface): Promise<boolean>;
    crearTicketEfectivo(total: number, idCesta: number, idCliente: string): Promise<boolean>;
    crearTicketDatafono3G(total: number, idCesta: number, idCliente: string): Promise<boolean>;
    crearTicketTKRS(total: number, totalTkrs: number, idCesta: number, idCliente: string): Promise<boolean>;
    crearTicketDeuda(total: number, idCesta: number, idCliente: string, infoClienteVip: any): Promise<boolean>;
    crearTicketConsumoPersonal(idCesta: number): Promise<boolean>;
    getTicketMasAntiguo(): Promise<import("bson").Document[]>;
    actualizarEstadoTicket(ticket: TicketsInterface): Promise<boolean>;
    actualizarComentario(ticket: TicketsInterface): Promise<boolean>;
    anularTicket(idTicket: number): Promise<boolean>;
}
export declare const ticketsInstance: TicketsClase;
