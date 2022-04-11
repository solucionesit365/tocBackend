import { InsertManyResult } from "mongodb";
import { conexion } from "../conexion/mongodb";

export async function buscar(busqueda: string): Promise<any> {
    const database = (await conexion).db('tocgame');
    const clientes = database.collection('clientes');
    const resultado = await clientes.find({$or:[{"nombre": { '$regex': new RegExp(busqueda, 'i')}}, {"tarjetaCliente": busqueda}]}, {limit: 20});
    const arrayResult = await resultado.toArray();
    return arrayResult;
}

export async function getClieneteByID(idCliente: string): Promise<any> {
    const database = (await conexion).db('tocgame');
    const clientes = database.collection('clientes');
    const resultado = await clientes.findOne({ id: idCliente });
    return resultado;
}

/* BORRA TODOS LOS CLIENTES */
export async function borrarClientes() {
    try {
        const database = (await conexion).db('tocgame');
        const clientes = database.collection('clientes');
        const resultado = await clientes.drop();
        return resultado;
    } catch(err) {
        if (err.codeName == 'NamespaceNotFound') {
            return true;
        } else {
            return false;
        }
    }
}

export async function insertarClientes(arrayClientes) {
    if (await borrarClientes()) {
        const database = (await conexion).db('tocgame');
        const clientes = database.collection('clientes');
        const resultado = await clientes.insertMany(arrayClientes);
        return resultado;
    } else {
        const res: InsertManyResult<any> = {
            acknowledged: false,
            insertedCount: 0,
            insertedIds: null
        } 
        return res;
    }

}

