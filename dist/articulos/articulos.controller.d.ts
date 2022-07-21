export declare class ArticulosController {
    getArticulo(params: any): Promise<{
        error: boolean;
        info: import("./articulos.interface").ArticulosInterface;
        mensaje?: undefined;
    } | {
        error: boolean;
        mensaje: string;
        info?: undefined;
    } | {
        error: boolean;
        mensaje: string;
    }>;
    setEstadoTarifaEspecial(params: any): {
        error: boolean;
        mensaje?: undefined;
    } | {
        error: boolean;
        mensaje: string;
    };
    editarArticulo(params: any): Promise<{
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
