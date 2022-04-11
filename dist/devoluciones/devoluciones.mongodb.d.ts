import { DevolucionesInterface } from "./devoluciones.interface";
export declare function insertarDevolucion(data: any): Promise<import("mongodb").InsertOneResult<import("bson").Document>>;
export declare function getDevolucionMasAntigua(): Promise<import("bson").Document>;
export declare function actualizarEstadoDevolucion(devolucion: DevolucionesInterface): Promise<import("mongodb").UpdateResult>;
export declare function getDevolucionByID(id: number): Promise<import("bson").Document>;
