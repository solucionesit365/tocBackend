export interface CajaInterface {
    _id: string;
    inicioTime: number;
    finalTime: number;
    idDependienta: number;
    totalApertura: number;
    totalCierre: number;
    descuadre: number;
    recaudado: number;
    nClientes: number;
    primerTicket: number;
    infoExtra: {
        cambioInicial: number;
        cambioFinal: number;
        totalSalidas: number;
        totalEntradas: number;
        totalEnEfectivo: number;
        totalTarjeta: number;
        totalDeuda: number;
    };
    ultimoTicket: number;
    calaixFetZ: number;
    detalleApertura: {
        _id: string;
        valor: number;
        unidades: number;
    }[];
    detalleCierre: {
        _id: string;
        valor: number;
        unidades: number;
    }[];
    enviado: boolean;
    enTransito: boolean;
    totalDatafono3G: number;
    totalClearOne: number;
    comentario?: string;
}
export interface CajaForSincroInterface {
    _id: number;
    inicioTime: number;
    finalTime: number;
    idDependienta: number;
    totalApertura: number;
    totalCierre: number;
    descuadre: number;
    recaudado: number;
    nClientes: number;
    primerTicket: number;
    infoExtra: {
        cambioInicial: number;
        cambioFinal: number;
        totalSalidas: number;
        totalEntradas: number;
        totalEnEfectivo: number;
        totalTarjeta: number;
        totalDeuda: number;
    };
    ultimoTicket: number;
    calaixFetZ: number;
    detalleApertura: {
        _id: string;
        valor: number;
        unidades: number;
    }[];
    detalleCierre: {
        _id: string;
        valor: number;
        unidades: number;
    }[];
    enviado: boolean;
    enTransito: boolean;
    totalDatafono3G: number;
    totalClearOne: number;
}
export declare const cajaVacia: CajaInterface;
