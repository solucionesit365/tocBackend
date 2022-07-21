export interface PromocionesInterface {
    _id: string;
    cantidadPrincipal: number;
    cantidadSecundario: number;
    fechaFinal: string;
    fechaInicio: string;
    precioFinal: number;
    principal: {
        _id: number;
    }[];
    secundario: {
        _id: number;
    }[];
}
