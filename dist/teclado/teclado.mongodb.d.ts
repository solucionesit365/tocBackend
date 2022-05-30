import { InsertManyResult } from "mongodb";
export declare function insertarTeclas(arrayTeclas: any): Promise<InsertManyResult<import("bson").Document>>;
export declare function borrarArticulos(): Promise<boolean>;
export declare function cambiarPosTecla(idArticle: any, nuevaPos: any, nombreMenu: any): Promise<import("mongodb").UpdateResult>;
