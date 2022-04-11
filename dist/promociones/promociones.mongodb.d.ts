import { InsertManyResult } from "mongodb";
export declare function getPromociones(): Promise<any>;
export declare function borrarPromociones(): Promise<boolean>;
export declare function insertarPromociones(arrayPromociones: any): Promise<InsertManyResult<import("bson").Document>>;
