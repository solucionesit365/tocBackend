import { DevolucionesInterface } from "./devoluciones.interface";
export declare class Devoluciones {
    private bloqueado;
    nuevaDevolucion(total: number, idCesta: number): Promise<boolean>;
    getDevolucionMasAntigua(): Promise<import("bson").Document>;
    actualizarEstadoDevolucion(devolucion: DevolucionesInterface): Promise<boolean>;
    private insertarDevolucion;
    getDevolucionByID(id: number): Promise<import("bson").Document>;
}
export declare const devolucionesInstance: Devoluciones;
