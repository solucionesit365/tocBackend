export declare class TrabajadoresController {
    getTrabajadoresFichados(): Promise<{
        error: boolean;
        res: import("bson").Document[];
    } | {
        error: boolean;
    }>;
    setTrabajadorActivo(params: any): Promise<{
        error: boolean;
    } | {
        error: boolean;
    }>;
    getCurrentTrabajador(): Promise<{
        error: boolean;
        trabajador: import("./trabajadores.interface").TrabajadoresInterface;
    } | {
        error: boolean;
        trabajador?: undefined;
    } | {
        error: boolean;
    }>;
    getCurrentTrabajadorr(): Promise<{
        error: boolean;
        trabajador: import("./trabajadores.interface").TrabajadoresInterface;
    } | {
        error: boolean;
        trabajador?: undefined;
    } | {
        error: boolean;
    }>;
    buscar(params: any): Promise<any[] | import("./trabajadores.interface").TrabajadoresInterface[]>;
    fichar(params: any): Promise<{
        error: boolean;
        mensaje?: undefined;
    } | {
        error: boolean;
        mensaje: string;
    } | {
        error: boolean;
        mensaje: string;
    }> | {
        error: boolean;
        mensaje: string;
    };
    desfichar(params: any): Promise<{
        error: boolean;
        mensaje?: undefined;
    } | {
        error: boolean;
        mensaje: string;
    } | {
        error: boolean;
        mensaje: string;
    }>;
    actualizarTrabajadores(): Promise<{
        error: boolean;
        mensaje?: undefined;
    } | {
        error: boolean;
        mensaje: string;
    } | {
        error: boolean;
        mensaje: string;
    } | {
        error: boolean;
        mensaje: string;
    } | {
        error: boolean;
        mensaje: string;
    }>;
    crearPlan(params: any): Promise<{
        error: boolean;
        mensaje?: undefined;
    } | {
        error: boolean;
        mensaje: any;
    } | {
        error: boolean;
        mensaje: string;
    }> | {
        error: boolean;
        mensaje: string;
    };
    getTrabajaronAyer(): Promise<any>;
    guardarHorasExtraCoordinacion(params: any): Promise<void | {
        error: boolean;
        mensaje?: undefined;
    } | {
        error: boolean;
        mensaje: any;
    } | {
        error: boolean;
        mensaje: string;
    }> | {
        error: boolean;
        mensaje: string;
    };
}
