import { InsertManyResult } from "mongodb";
export declare function getMenus(): Promise<any>;
export declare function borrarMenus(): Promise<boolean>;
export declare function insertarMenus(arrayMenus: any): Promise<InsertManyResult<import("bson").Document>>;
