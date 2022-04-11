import { InsertManyResult } from "mongodb";
import { conexion } from "../conexion/mongodb";

// export async function getPromociones(): Promise<any> {
//     const database = (await conexion).db('tocgame');
//     const menus = database.collection('menus');
//     const resultado = await (await menus.find()).toArray();
    
//     return resultado;
// }

export async function getMenus(): Promise<any> {
    const database = (await conexion).db('tocgame');
    const menus = database.collection('doble-menus');
    const resultado = await (await menus.find()).toArray();
    
    return resultado;
}


export async function borrarMenus() {
    try {
        const database = (await conexion).db('tocgame');
        const menus = database.collection('doble-menus');
        const resultado = await menus.drop();
        return resultado;
    } catch(err) {
        if (err.codeName == 'NamespaceNotFound') {
            return true;
        } else {
            return false;
        }
    }
}

export async function insertarMenus(arrayMenus) {
    if (await borrarMenus()) {
        const database = (await conexion).db('tocgame');
        const menus = database.collection('doble-menus');
        const resultado = menus.insertMany(arrayMenus);
        
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