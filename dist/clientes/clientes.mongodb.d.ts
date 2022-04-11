import { InsertManyResult } from "mongodb";
export declare function buscar(busqueda: string): Promise<any>;
export declare function getClieneteByID(idCliente: string): Promise<any>;
export declare function borrarClientes(): Promise<boolean>;
export declare function insertarClientes(arrayClientes: any): Promise<InsertManyResult<import("bson").Document>>;
