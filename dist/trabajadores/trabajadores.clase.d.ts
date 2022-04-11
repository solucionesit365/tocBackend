import { SincroFichajesInterface, TrabajadoresInterface } from "./trabajadores.interface";
export declare class TrabajadoresClase {
    buscar(busqueda: string): Promise<any[] | TrabajadoresInterface[]>;
    mantenerTrabajadoresFichados(nuevoArray: TrabajadoresInterface[]): Promise<{
        error: boolean;
        info: TrabajadoresInterface[];
    } | {
        error: boolean;
        info: any[];
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
    }>;
    getCurrentIdTrabajador(): Promise<number>;
    getCurrentTrabajador(): Promise<TrabajadoresInterface>;
    setCurrentTrabajador(idTrabajador: number): Promise<boolean>;
    setCurrentTrabajadorPorNombre(id: any): Promise<boolean>;
    getTrabajadoresFichados(): Promise<import("bson").Document[]>;
    getTrabajador(idTrabajador: number): Promise<TrabajadoresInterface>;
    ficharTrabajador(idTrabajador: number, idPlan: string): Promise<boolean>;
    desficharTrabajador(idTrabajador: number): Promise<boolean>;
    nuevoFichajesSincro(tipo: "ENTRADA" | "SALIDA", idTrabajador: number, idPlan: string): Promise<import("mongodb").InsertOneResult<import("bson").Document>>;
    getFichados(): Promise<TrabajadoresInterface[]>;
    insertarTrabajadores(arrayTrabajadores: any): Promise<boolean>;
    getFichajeMasAntiguo(): Promise<import("bson").Document>;
    actualizarEstadoFichaje(fichaje: SincroFichajesInterface): Promise<boolean>;
    existePlan(idPlan: string): Promise<boolean>;
    getInicioFinalDiaAnterior(): {
        inicioTime: number;
        finalTime: number;
    };
    getTrabajaronAyer(): Promise<any>;
    guardarHorasExtraCoordinacion(horasExtra: number, horasCoordinacion: number, idTrabajador: number, timestamp: number): Promise<{
        error: boolean;
        mensaje?: undefined;
    } | {
        error: boolean;
        mensaje: any;
    } | {
        error: boolean;
        mensaje: string;
    }>;
}
export declare const trabajadoresInstance: TrabajadoresClase;
