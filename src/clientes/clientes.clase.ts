import * as schClientes from './clientes.mongodb';
import { ClientesInterface } from './clientes.interface';
import axios from 'axios';
import { parametrosInstance } from 'src/parametros/parametros.clase';

export class Clientes {
    private clienteVip: boolean = false;
    /* Busca tanto nombres como tarjeta cliente */
    buscar(cadena: string) {
        return schClientes.buscar(cadena).then((res: ClientesInterface[]) => {
            if (res.length > 0) {
                return res;
            } else {
                return [];
            }
        }).catch((err) => {
            console.log(err);
            return [];
        });
    }

    getClienteByID(idCliente: string): Promise<ClientesInterface> {
        return schClientes.getClieneteByID(idCliente).then((res: ClientesInterface) => {
            return res;
        }).catch((err) => {
            console.log(err);
            return null;
        });
    }

    insertarClientes(arrayClientes) {
        return schClientes.insertarClientes(arrayClientes).then((res) => {
            return res.acknowledged;
        }).catch((err) => {
            console.log(err);
            return false;
        });
    }

    getPuntosCliente(idClienteFinal: string) {
        return axios.post('clientes/getPuntosCliente', { database: parametrosInstance.getParametros().database, idClienteFinal }).then((res: any) => {
            if (res.data.error == false) {
                return res.data.info;
            } else {
                console.log(res.data.error);
                return 0;
            }
        }).catch((err) => {
            console.log(err);
            return 0;
        });
    }

    setEstadoClienteVIP(nuevoEstado: boolean) {
        this.clienteVip = nuevoEstado;
    }

    getEstadoClienteVIP() {
        return this.clienteVip;
    }
}
export const clienteInstance = new Clientes();
