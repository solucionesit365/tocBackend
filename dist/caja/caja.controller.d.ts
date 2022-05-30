export declare class CajaController {
    cerrarCaja(params: any): Promise<{
        error: boolean;
        mensaje?: undefined;
    } | {
        error: boolean;
        mensaje: string;
    }>;
    abrirCaja(params: any): Promise<{
        error: boolean;
    } | {
        error: boolean;
    }> | {
        error: boolean;
        mensaje: string;
    };
    estadoCaja(): Promise<{
        abierta: boolean;
        error: boolean;
    } | {
        error: boolean;
        mensaje: string;
    }>;
    getMonedasUltimoCierre(): Promise<{
        error: boolean;
        info: any;
    } | {
        error: boolean;
        mensaje: string;
    }>;
}
