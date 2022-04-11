export declare class Impresora {
    imprimirTicket(idTicket: number, esDevolucion?: boolean): Promise<void>;
    private _venta;
    imprimirSalida(cantidad: number, fecha: number, nombreTrabajador: string, nombreTienda: string, concepto: string, tipoImpresora: string, codigoBarras: string): Promise<void>;
    imprimirEntrada(totalIngresado: number, fecha: number, nombreDependienta: string): Promise<void>;
    imprimirTest(): Promise<void>;
    imprimirCaja(calaixFet: any, nombreTrabajador: any, descuadre: any, nClientes: any, recaudado: any, arrayMovimientos: any[], nombreTienda: any, fI: any, fF: any, cInicioCaja: any, cFinalCaja: any, tipoImpresora: any): Promise<void>;
    abrirCajon(): Promise<void>;
    mostrarVisor(data: any): void;
    imprimirEntregas(): Promise<{
        error: boolean;
        info: string;
    } | {
        error: boolean;
        info: string;
    }>;
}
export declare const impresoraInstance: Impresora;
