import { InsertManyResult } from "mongodb";
import { conexion } from "../conexion/mongodb";

export async function insertarTeclas(arrayTeclas) {
    // const database = (await conexion).db('tocgame');
    // const teclas = database.collection('teclas');
    // const resultado = await teclas.insertMany(arrayTeclas);

    if (await borrarArticulos()) {
        const database = (await conexion).db('tocgame');
        const articulos = database.collection('teclas');
        const resultado = await articulos.insertMany(arrayTeclas);
        
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

export async function borrarArticulos() {
    try {
        const database = (await conexion).db('tocgame');
        const articulos = database.collection('teclas');
        const resultado = await articulos.drop();
        return resultado;
    } catch(err) {
        if (err.codeName == 'NamespaceNotFound') {
            return true;
        } else {
            return false;
        }
    }
}

export async function cambiarPosTecla(idArticle, nuevaPos, nombreMenu) {
    const database = (await conexion).db('tocgame');
    const articulos = database.collection('teclas');
    const resultado = await articulos.updateOne({ idArticle: idArticle}, { $set: { pos: nuevaPos, nomMenu: nombreMenu }});
    
    return resultado;
}