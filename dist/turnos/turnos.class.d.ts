import { TurnosInterface } from "./turnos.interface";
export declare class TurnosClass {
    getPlanes(): Promise<{
        error: boolean;
        info: any;
    } | {
        error: boolean;
        mensaje: string;
    }>;
    eliminarUtilizados(arrayPlanes: TurnosInterface[]): Promise<TurnosInterface[]>;
}
