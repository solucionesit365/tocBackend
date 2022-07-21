export declare class TecladoClase {
    insertarTeclas(arrayTeclas: any): Promise<boolean>;
    actualizarTeclado(): Promise<{
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
    cambiarPosTecla(idArticle: any, nuevaPos: any, nombreMenu: any): Promise<import("mongodb").UpdateResult>;
}
export declare const tecladoInstance: TecladoClase;
