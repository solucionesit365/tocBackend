import { MovimientosInterface } from "./movimientos.interface";
export declare function getMovimientosIntervalo(inicioTime: number, finalTime: number): Promise<any>;
export declare function nuevaSalida(data: any): Promise<import("mongodb").InsertOneResult<import("bson").Document>>;
export declare function getUltimoCodigoBarras(): Promise<any>;
export declare function resetContadorCodigoBarras(): Promise<import("mongodb").UpdateResult>;
export declare function actualizarCodigoBarras(): Promise<import("mongodb").UpdateResult>;
export declare function getMovimientoMasAntiguo(): Promise<import("bson").Document>;
export declare function limpiezaMovimientos(): Promise<void>;
export declare function actualizarEstadoMovimiento(movimiento: MovimientosInterface): Promise<import("mongodb").UpdateResult>;
