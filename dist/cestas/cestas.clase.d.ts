import { CestasInterface } from './cestas.interface';
export declare class CestaClase {
    private cesta;
    private udsAplicar;
    constructor();
    updateIdCestaTrabajador(id: string): Promise<boolean>;
    getCesta(idCesta: number): Promise<CestasInterface>;
    getCestaRandom(): Promise<CestasInterface>;
    reiniciarCesta(idCestaBorrar: any): Promise<CestasInterface>;
    borrarCestaActiva(): Promise<boolean>;
    nuevaCestaVacia(): CestasInterface;
    getTodasCestas(): Promise<CestasInterface[]>;
    borrarCesta(idCestaBorrar: any): Promise<boolean>;
    eliminarCesta(nombreCesta: any): Promise<boolean>;
    setCesta(cesta: CestasInterface): Promise<boolean>;
    crearNuevaCesta(nombreCesta: string): Promise<boolean | CestasInterface>;
    crearCestaParaTrabajador(idTrabajador: number): Promise<boolean | CestasInterface>;
    borrarItemCesta(idCesta: number, idArticulo: number): Promise<boolean | CestasInterface>;
    limpiarCesta(unaCesta: CestasInterface, posicionPrincipal: number, posicionSecundario: number, sobraCantidadPrincipal: number, sobraCantidadSecundario: number, pideDelA: number, pideDelB: number): Promise<CestasInterface>;
    insertarArticuloCesta(infoArticulo: any, unidades: number, idCesta: number, infoAPeso?: any): Promise<CestasInterface>;
    addItem(idArticulo: number, idBoton: string, aPeso: boolean, infoAPeso: any, idCesta: number, unidades?: number): Promise<CestasInterface | {
        suplementos: boolean;
        data: any[];
    }>;
    setUnidadesAplicar(unidades: number): void;
    recalcularIvas(cesta: CestasInterface): Promise<CestasInterface>;
    borrarArticulosCesta(idCesta: number): Promise<boolean | CestasInterface>;
    addSuplemento(idCesta: any, suplementos: any, idArticulo: any, posArticulo?: number): Promise<boolean | CestasInterface>;
    modificarSuplementos(cestaId: any, idArticulo: any, posArticulo: any): Promise<{
        suplementos: boolean;
        suplementosData: any[];
        suplementosSeleccionados: number[];
    }>;
    enviarACocina(idCesta: any): Promise<boolean>;
    getCestaDiferente(id_cesta: any): Promise<false | import("bson").Document>;
    getCestaByTrabajadorID(idTrabajador: number): Promise<CestasInterface>;
}
declare const cestas: CestaClase;
export { cestas };
