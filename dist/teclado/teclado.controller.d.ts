export declare class TecladoController {
    clickTecla(params: any): Promise<{
        error: boolean;
        bloqueado: boolean;
        cesta: import("../cestas/cestas.interface").CestasInterface | {
            suplementos: boolean;
            data: any[];
        };
    } | {
        error: boolean;
        mensaje: string;
    }>;
    actualizarArticulos(): Promise<{
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
    } | {
        error: boolean;
        mensaje: string;
    }>;
    cambiarPosTecla(params: any): Promise<{
        error: boolean;
        info: import("mongodb").UpdateResult;
        mensaje?: undefined;
    } | {
        error: boolean;
        mensaje: string;
        info?: undefined;
    }> | {
        error: boolean;
        mensaje: string;
    };
}
