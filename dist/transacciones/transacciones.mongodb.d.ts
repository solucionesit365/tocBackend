import { CestasInterface } from "src/cestas/cestas.interface";
export declare function crearTransaccion(cesta: CestasInterface, total: number, idCliente: string): Promise<import("mongodb").InsertOneResult<import("bson").Document>>;
export declare function getTransaccionById(idTransaccion: string): Promise<import("bson").Document>;
export declare function getUltimaTransaccion(): Promise<import("bson").Document[]>;
export declare function setPagada(idTransaccion: string): Promise<import("mongodb").UpdateResult>;
