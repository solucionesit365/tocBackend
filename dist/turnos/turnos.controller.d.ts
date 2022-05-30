export declare class TurnosController {
    getPlanes(): Promise<{
        error: boolean;
        info: any;
        mensaje?: undefined;
    } | {
        error: boolean;
        mensaje: any;
        info?: undefined;
    } | {
        error: boolean;
        mensaje: string;
    }>;
}
