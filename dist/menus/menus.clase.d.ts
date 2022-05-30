export declare class MenusClase {
    private bloqueado;
    constructor();
    clickMenu(nombreMenu: string): Promise<any>;
    getBloqueado(): boolean;
    getMenus(): Promise<any>;
    setBloqueado(x: boolean): void;
    insertarMenus(arrayMenus: any): Promise<boolean>;
    getSubmenus(tag: any): Promise<import("bson").Document[]>;
}
export declare const menusInstance: MenusClase;
