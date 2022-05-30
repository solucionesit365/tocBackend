export declare class DobleMenusClase {
    private bloqueado;
    constructor();
    clickMenu(nombreMenu: string): void;
    getBloqueado(): boolean;
    getMenus(): Promise<any>;
    setBloqueado(x: boolean): void;
    insertarMenus(arrayMenus: any): any[] | Promise<boolean>;
}
export declare const dobleMenusInstance: DobleMenusClase;
