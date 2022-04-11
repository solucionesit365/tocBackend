import { InsertManyResult } from "mongodb";
export declare function getMenus(): Promise<any>;
export declare function getTecladoMain(nombreMenu: string): Promise<any>;
export declare function borrarMenus(): Promise<boolean>;
export declare function insertarMenus(arrayMenus: any): Promise<InsertManyResult<import("bson").Document>>;
export declare function getSubmenus(tag: string): Promise<import("bson").Document[]>;
