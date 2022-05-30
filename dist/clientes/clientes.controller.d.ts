export declare class ClientesController {
    buscarCliente(params: any): Promise<any[] | import("./clientes.interface").ClientesInterface[]>;
    getClienteByID(params: any): Promise<any[] | import("./clientes.interface").ClientesInterface[]> | Promise<{
        error: boolean;
        infoCliente: import("./clientes.interface").ClientesInterface;
        mensaje?: undefined;
    } | {
        error: boolean;
        mensaje: string;
        infoCliente?: undefined;
    } | {
        error: boolean;
        mensaje: string;
    }> | {
        error: boolean;
        mensaje: string;
    };
    comprobarVIP(params: any): Promise<{
        error: boolean;
        info: any;
        mensaje?: undefined;
    } | {
        error: boolean;
        mensaje: string;
        info?: undefined;
    } | {
        error: boolean;
        mensaje: string;
    } | {
        error: boolean;
        mensaje: string;
    }>;
    descargarClientesFinales(): Promise<{
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
    crearNuevoCliente(params: any): Promise<{
        error: boolean;
        mensaje?: undefined;
    } | {
        error: boolean;
        mensaje: any;
    } | {
        error: boolean;
        mensaje: string;
    }> | {
        error: boolean;
        mensaje: string;
    };
}
