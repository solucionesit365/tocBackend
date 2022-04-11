import { InsertManyResult } from "mongodb";
import { UtilesModule } from "../utiles/utiles.module";
import { conexion } from "../conexion/mongodb";
import { SincroFichajesInterface } from "./trabajadores.interface";

export async function getCurrentIdTrabajador() {
    const database = (await conexion).db('tocgame');
    const parametros = database.collection('parametros');
    const resultado = await parametros.findOne({_id: "PARAMETROS"});
    
    return resultado;
}

export async function limpiezaFichajes() {
    const database = (await conexion).db('tocgame');
    const fichajes = database.collection('sincro-fichajes');
    fichajes.deleteMany({ enviado: true, _id: { $lte: UtilesModule.restarDiasTimestamp(Date.now()) } });
}

export async function buscar(busqueda: string) {
    const database = (await conexion).db('tocgame');
    const trabajadores = database.collection('trabajadores');
    const resultado = await trabajadores.find({ $or: [{ "nombre": { '$regex': new RegExp(busqueda, "i") } }, { "nombreCorto": { '$regex': new RegExp(busqueda, "i") } }] }, {limit: 4});

    const arrayTrabajadores = await resultado.toArray();
    
    return arrayTrabajadores;
}

export async function getTrabajador(idTrabajador: number): Promise<any> {
    const database = (await conexion).db('tocgame');
    const trabajadores = database.collection('trabajadores');
    const resultado = await trabajadores.findOne({_id: idTrabajador}); //_id y idTrabajador siempre son iguales (duplicados)
    
    return resultado;
}

export async function getTrabajadorPorNombre(id: number) {
    const database = (await conexion).db('tocgame');
    const trabajadores = database.collection('trabajadores');
    const resultado = await trabajadores.findOne({idTrabajador: id}); //_id y idTrabajador siempre son iguales (duplicados)
    
    return resultado;
}

export async function setCurrentIdTrabajador(idTrabajador: number) {
    const database = (await conexion).db('tocgame');
    const parametros = database.collection('parametros');
    const resultado = await parametros.updateOne({_id: "PARAMETROS"}, { $set: { "idCurrentTrabajador": idTrabajador }}, {upsert: true} );

    return resultado;
}

export async function getTrabajadoresFichados() {
    const database = (await conexion).db('tocgame');
    const trabajadores = database.collection('trabajadores');
    const resultado = (await trabajadores.find({fichado: true})).toArray();
    
    return resultado;
}

export async function ficharTrabajador(idTrabajador: number) {
    const database = (await conexion).db('tocgame');
    const trabajadores = database.collection('trabajadores');
    const resultado = trabajadores.updateOne({_id: idTrabajador}, {$set: { "fichado": true} });
    
    return resultado;
}
export async function desficharTrabajador(idTrabajador: number) {
    const database = (await conexion).db('tocgame');
    const trabajadores = database.collection('trabajadores');
    const resultado = trabajadores.updateOne({_id: idTrabajador}, {$set: {"fichado": false}});
    
    return resultado;
}

export async function insertNuevoFichaje(data) {
    const database = (await conexion).db('tocgame');
    const sincrofichajes = database.collection('sincro-fichajes');
    const resultado = sincrofichajes.insertOne(data);
    
    return resultado;
}

export async function buscarTrabajadoresFichados(): Promise<any> {
    const database = (await conexion).db('tocgame');
    const trabajadores = database.collection('trabajadores');
    const resultado = await (await trabajadores.find({fichado: true})).toArray();
    
    return resultado;
}



export async function borrarTrabajadores() {
    try {
        const database = (await conexion).db('tocgame');
        const trabajadores = database.collection('trabajadores');
        const resultado = await trabajadores.drop();
        
        return resultado;
    } catch(err) {
        if (err.codeName == 'NamespaceNotFound') {
            return true;
        } else {
            return false;
        }
    }

}

export async function insertarTrabajadores(arrayTrabajadores) {
    if (await borrarTrabajadores()) {
        const database = (await conexion).db('tocgame');
        const trabajadores = database.collection('trabajadores');
        const resultado = await trabajadores.insertMany(arrayTrabajadores);
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

export async function getFichajeMasAntiguo() {
    const database = (await conexion).db('tocgame');
    const sincroFichajes = database.collection('sincro-fichajes');
    const resultado = await sincroFichajes.findOne({ enviado: false }, { sort: {_id: 1} } );
    return resultado;
}

export async function getTrabajaronAyer(inicioTime: number, finalTime: number) {
    const database = (await conexion).db('tocgame');
    const sincroFichajes = database.collection('sincro-fichajes');
    const resultado = await sincroFichajes.find( { $and: [ { _id: { $gte: inicioTime } }, { _id: { $lte: finalTime } }, {tipo: "SALIDA"} ] } ).toArray();
    return resultado;
}

export async function actualizarEstadoFichaje(fichaje: SincroFichajesInterface) {
    const database = (await conexion).db('tocgame');
    const sincroFichajes = database.collection('sincro-fichajes');
    const resultado = sincroFichajes.updateOne({ _id: fichaje._id }, { $set: {
        "enviado": fichaje.enviado,
        "intentos": fichaje.intentos,
        "comentario": fichaje.comentario
    } });
    return resultado;
}

export async function existePlan(idPlan: string) {
    const database = (await conexion).db('tocgame');
    const sincroFichajes = database.collection('sincro-fichajes');
    const resultado = sincroFichajes.findOne({ idPlan: idPlan });
    return resultado;
}