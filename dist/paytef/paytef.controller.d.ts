export declare class PaytefController {
    comprobarEstado(): Promise<{
        error: boolean;
        mensaje: string;
        continuo?: undefined;
    } | {
        error: boolean;
        continuo: boolean;
        mensaje?: undefined;
    } | {
        error: boolean;
        continuo: boolean;
        mensaje?: undefined;
    } | {
        error: boolean;
        mensaje: string;
        continuo?: undefined;
    }>;
    cancelarOperacionActual(): Promise<boolean>;
    buscarDispositivos(): void;
}
