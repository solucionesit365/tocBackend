import { InsertManyResult } from "mongodb";
import { conexion } from "../conexion/mongodb";

export async function insertarParametrosTicket(data: any) {
    if (borrarInfoTicket()) {
        const database = (await conexion).db('tocgame');
        const paramTickets = database.collection('parametros-tickets');
        const resultado = await paramTickets.insertMany(data);
        return resultado.acknowledged;
    } else {
        const res: InsertManyResult<any> = {
            acknowledged: false,
            insertedCount: 0,
            insertedIds: null
        } 
        return res.acknowledged;
    }

}

export async function getParamsTicket() {
    const database = (await conexion).db('tocgame');
    const paramTickets = database.collection('parametros-tickets');
    const arrayResult = await (await paramTickets.find({})).toArray();
    return arrayResult;
}

export async function borrarInfoTicket() {
    try {
        const database = (await conexion).db('tocgame');
        const paramTickets = database.collection('parametros-tickets');
        const resultado = await paramTickets.drop();
        return resultado;
    } catch(err) {
        if (err.codeName == 'NamespaceNotFound') {
            return true;
        } else {
            return false;
        }
    }
}