import { CestasInterface } from "../cestas/cestas.interface";
import { PromocionesInterface } from "./promociones.interface";
export declare class OfertasClase {
    private promociones;
    private promocionesActivas;
    constructor();
    deshacerOfertas(cesta: CestasInterface): CestasInterface;
    existeArticuloParaOfertaEnCesta(cesta: CestasInterface, idArticulo: number, unidadesNecesarias: number): number;
    setEstadoPromociones(x: boolean): void;
    getEstadoPromociones(): boolean;
    teLoAplicoTodo(necesariasPrincipal: number, necesariasSecundario: number, cesta: CestasInterface, posicionPrincipal: number, posicionSecundario: number, pideDelA: number, pideDelB: number, precioPromo: number, idPromo: string): Promise<CestasInterface>;
    buscarOfertas(unaCesta: CestasInterface, viejoIva: any): Promise<CestasInterface>;
    insertarLineaPromoCestaCombo(cesta: CestasInterface, tipoPromo: number, unidades: number, total: number, idPromo: string, idPrincipal: number, idSecundario: number, cantidadPrincipal: number, cantidadSecundario: number): Promise<CestasInterface>;
    insertarLineaPromoCestaIndividual(cesta: CestasInterface, tipoPromo: number, unidades: number, total: number, idPromo: string, idPrincipal: number, cantidadPrincipal: number): Promise<CestasInterface>;
    calcularPrecioRealCombo(tipoPromo: number, idPrincipal: number, idSecundario: number, cantidadPrincipal: number, cantidadSecundario: number, unidadesOferta: number, precioTotalOferta: number): Promise<{
        precioRealPrincipal: number;
        precioRealSecundario: number;
    }>;
    calcularPrecioRealIndividual(tipoPromo: number, idPrincipal: number, cantidadPrincipal: number, unidadesOferta: number, precioTotalOferta: number): Promise<{
        precioRealPrincipal: number;
    }>;
    insertarPromociones(arrayPromociones: PromocionesInterface[]): Promise<boolean>;
    devuelveTrue(): Promise<boolean>;
    descargarPromociones(): Promise<boolean>;
}
declare const ofertas: OfertasClase;
export { ofertas };
