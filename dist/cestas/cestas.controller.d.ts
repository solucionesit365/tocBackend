export declare class CestasController {
    borrarCesta(params: any): Promise<{
        okey: boolean;
        cestaNueva: import("./cestas.interface").CestasInterface;
        error?: undefined;
    } | {
        okey: boolean;
        error: string;
        cestaNueva?: undefined;
    } | {
        okey: boolean;
        error: string;
    } | {
        okey: boolean;
        error: string;
    }>;
    borrarItemCesta(params: any): Promise<{
        okey: boolean;
        cestaNueva: boolean | import("./cestas.interface").CestasInterface;
    } | {
        okey: boolean;
        error: string;
    }>;
    borrarArticulosCesta(params: any): Promise<{
        error: boolean;
        info: true | import("./cestas.interface").CestasInterface;
        mensaje?: undefined;
    } | {
        error: boolean;
        mensaje: string;
        info?: undefined;
    }> | {
        error: boolean;
        mensaje: string;
    };
    getCesta(): Promise<import("./cestas.interface").CestasInterface | {
        okey: boolean;
        error: string;
    }>;
    getCestaDiferent(params: any): Promise<false | import("bson").Document | {
        okey: boolean;
        error: string;
    }>;
    getCestaByID(params: any): Promise<{
        error: boolean;
        info: import("./cestas.interface").CestasInterface;
        mensaje?: undefined;
    } | {
        error: boolean;
        mensaje: string;
        info?: undefined;
    } | {
        error: boolean;
        mensaje: string;
    }>;
    getCestaCurrentTrabajador(): Promise<{
        error: boolean;
        info: import("./cestas.interface").CestasInterface;
        mensaje?: undefined;
    } | {
        error: boolean;
        mensaje: string;
        info?: undefined;
    } | {
        error: boolean;
        mensaje: string;
    }>;
    crearCesta(params: any): Promise<{
        error: boolean;
        info: true | import("./cestas.interface").CestasInterface;
        mensaje?: undefined;
    } | {
        error: boolean;
        mensaje: string;
        info?: undefined;
    }> | {
        error: boolean;
        mensaje: string;
    };
    getCestas(): Promise<{
        error: boolean;
        info: import("./cestas.interface").CestasInterface[];
    } | {
        error: boolean;
        mensaje: string;
    }>;
    setUnidadesAplicar(params: any): {
        okey: boolean;
    };
    clickTeclaArticulo(params: any): Promise<{
        error: boolean;
        bloqueado: boolean;
        cesta: import("./cestas.interface").CestasInterface | {
            suplementos: boolean;
            data: any[];
        };
    } | {
        error: boolean;
        bloqueado: boolean;
    }>;
    regalarProducto(params: any): Promise<{
        error: boolean;
        cesta: import("./cestas.interface").CestasInterface;
        mensaje?: undefined;
    } | {
        error: boolean;
        mensaje: string;
        cesta?: undefined;
    } | {
        error: boolean;
        mensaje: string;
    } | {
        error: boolean;
        mensaje: string;
    }> | {
        error: boolean;
        mensaje: string;
    };
    addSuplemento(params: any): Promise<{
        error: boolean;
        bloqueado: boolean;
        cesta: boolean | import("./cestas.interface").CestasInterface;
    } | {
        error: boolean;
        bloqueado: boolean;
    }>;
    modificarSuplementos(params: any): Promise<{
        suplementos: boolean;
        suplementosData: any[];
        suplementosSeleccionados: number[];
    } | {
        suplementos: boolean;
        suplementosData?: undefined;
        suplementosSeleccionados?: undefined;
    }>;
    enviarACocina(params: any): Promise<boolean>;
    getCestaByTrabajadorId(params: any): Promise<{
        error: boolean;
        info: import("./cestas.interface").CestasInterface;
        mensaje?: undefined;
    } | {
        error: boolean;
        mensaje: string;
        info?: undefined;
    }>;
}
