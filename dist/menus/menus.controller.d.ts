export declare class MenusController {
    clickMenu(params: any): Promise<{
        bloqueado: boolean;
        resultado: any;
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
    getSubmenus(params: any): Promise<{
        bloqueado: boolean;
        resultado: import("bson").Document[];
    } | {
        bloqueado: boolean;
        resultado?: undefined;
    }>;
}
