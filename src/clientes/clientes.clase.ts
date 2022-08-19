import * as schClientes from './clientes.mongodb';
import {ClientesInterface} from './clientes.interface';
import axios from 'axios';
import {parametrosInstance} from 'src/parametros/parametros.clase';

export class Clientes {
  private clienteVip: boolean = false;
  /* Busca tanto nombres como tarjeta cliente */
  buscar(cadena: string) {
    return schClientes.buscar(cadena).then((res: ClientesInterface[]) => {
      if (res.length > 0) {
        console.log(res);
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

  /* Eze v23 */
  async getPuntosCliente(idClienteFinal: string): Promise<number> {
    try {
      return (await axios.post<any>('clientes/getPuntosCliente', {database: (await parametrosInstance.getParametros()).database, idClienteFinal})).data.info;
    } catch (err) {
      console.log(err);
      return 0;
    }    
  }

  /* Eze v23 */
  setEstadoClienteVIP(nuevoEstado: boolean) {
    this.clienteVip = nuevoEstado;
  }

  getEstadoClienteVIP() {
    return this.clienteVip;
  }
}
export const clienteInstance = new Clientes();
