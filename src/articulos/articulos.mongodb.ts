import { InsertManyResult } from "mongodb";
import { conexion } from "../conexion/mongodb";

export async function getInfoArticulo(idArticulo: number): Promise<any> {
    const database = (await conexion).db('tocgame');
    const articulos = database.collection('articulos');
    const resultado = await articulos.findOne({_id: idArticulo});
    
    return resultado;
}

export async function insertarArticulos(arrayArticulos, esTarifaEspecial = false) {
    const apuntoColeccion = (esTarifaEspecial == true) ? ('articulosTarifaEspecial') : ('articulos');
    if (await borrarArticulos(esTarifaEspecial)) {
        const database = (await conexion).db('tocgame');
        const articulos = database.collection(apuntoColeccion);
        const resultado = await articulos.insertMany(arrayArticulos);
        
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

export async function borrarArticulos(esTarifaEspecial: boolean) {
    try {
        const apuntoColeccion = (esTarifaEspecial == true) ? ('articulosTarifaEspecial') : ('articulos');
        const database = (await conexion).db('tocgame');
        const articulos = database.collection(apuntoColeccion);
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

export async function getInfoArticuloTarifaEspecial(idArticulo: number): Promise<any> {
    const database = (await conexion).db('tocgame');
    const articulos = database.collection('articulosTarifaEspecial');
    const resultado = await articulos.findOne({_id: idArticulo});
    
    return resultado;
}

export async function getSuplementos(suplementos) {
    const database = (await conexion).db('tocgame');
    const articulos = database.collection('articulos');
    const suplementosData = []
    for(let i in suplementos) {
        const resultado = await (await articulos.find({ _id: suplementos[i] })).toArray();
        suplementosData.push(resultado[0]);
    }
    return suplementosData;
}

export async function editarArticulo(id, nombre, precioBase, precioConIva) {
    const database = (await conexion).db('tocgame');
    const articulos = database.collection('articulos');
    const teclas = database.collection('teclas');
    await teclas.updateMany({ idArticle: id }, { $set: { 'nombreArticulo': nombre } }, { upsert: true });
    console.log(id, nombre, precioBase, precioConIva)
    return await articulos.updateOne({ _id: id }, { $set: { 'nombre': nombre, 'precioBase': precioBase, 'precioConIva': precioConIva } }, { upsert: true });
}