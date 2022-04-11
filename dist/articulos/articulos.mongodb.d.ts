import { InsertManyResult } from "mongodb";
export declare function getInfoArticulo(idArticulo: number): Promise<any>;
export declare function insertarArticulos(arrayArticulos: any, esTarifaEspecial?: boolean): Promise<InsertManyResult<import("bson").Document>>;
export declare function borrarArticulos(esTarifaEspecial: boolean): Promise<boolean>;
export declare function getInfoArticuloTarifaEspecial(idArticulo: number): Promise<any>;
export declare function getSuplementos(suplementos: any): Promise<any[]>;
export declare function editarArticulo(id: any, nombre: any, precioBase: any, precioConIva: any): Promise<import("mongodb").UpdateResult>;
