export declare class DobleMenusController {
    clickMenu(params: any): Promise<{
        bloqueado: boolean;
        resultado: import("bson").Document[];
    } | {
        bloqueado: boolean;
        error: any;
    }> | {
        bloqueado: boolean;
    };
    getMenus(): Promise<{
        bloqueado: boolean;
        resultado: any;
    } | {
        bloqueado: boolean;
        resultado?: undefined;
    }>;
}
