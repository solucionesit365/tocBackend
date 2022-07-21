import { ClientesInterface } from './clientes.interface';
export declare class Clientes {
    private clienteVip;
    buscar(cadena: string): Promise<any[] | ClientesInterface[]>;
    getClienteByID(idCliente: string): Promise<ClientesInterface>;
    insertarClientes(arrayClientes: any): Promise<boolean>;
    getPuntosCliente(idClienteFinal: string): Promise<any>;
    setEstadoClienteVIP(nuevoEstado: boolean): void;
    getEstadoClienteVIP(): boolean;
}
export declare const clienteInstance: Clientes;
