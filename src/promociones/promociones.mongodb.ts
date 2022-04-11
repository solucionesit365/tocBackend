import { InsertManyResult } from "mongodb";
import { conexion } from "../conexion/mongodb";

export async function getPromociones(): Promise<any> {
    const database = (await conexion).db('tocgame');
    const promociones = database.collection('promociones');
    const resultado = await (await promociones.find()).toArray();
    
    return resultado;
}

export async function borrarPromociones() {
    try {
        const database = (await conexion).db('tocgame');
        const promociones = database.collection('promociones');
        const resultado = await promociones.drop();
        return resultado;
    } catch(err) {
        if (err.codeName == 'NamespaceNotFound') {
            return true;
        } else {
            return false;
        }
    }
}

export async function insertarPromociones(arrayPromociones) {
    if (await borrarPromociones()) {
        const database = (await conexion).db('tocgame');
        const promociones = database.collection('promociones');
        const resultado = await promociones.insertMany(arrayPromociones);
        
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

