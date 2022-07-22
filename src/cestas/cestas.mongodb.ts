import { conexion } from "../conexion/mongodb";
import { CestasInterface } from "./cestas.interface";

export async function getUnaCesta(): Promise<any> {
    const database = (await conexion).db('tocgame');
    const cesta = database.collection('cestas');
    const resultado = await cesta.findOne();
    return resultado;
}

export async function getCestaConcreta(idCesta: number): Promise<any> {
    const database = (await conexion).db('tocgame');
    const cesta = database.collection('cestas');
    let resultado = await cesta.findOne({_id: idCesta});
    if(!resultado) resultado = await cesta.findOne({ _id: idCesta.toString() });
    return resultado;
}
export async function getCestaByTrabajadorID(idTrabajador: number) {
    const database = (await conexion).db('tocgame');
    const cesta = database.collection('cestas');
    let resultado = await cesta.findOne({idTrabajador: idTrabajador});
    return resultado;
}
export async function getCestaByID(idCesta: number) {
    const database = (await conexion).db('tocgame');
    const cesta = database.collection('cestas');
    let resultado = await cesta.findOne({_id: idCesta});
    return resultado;
}


export async function borrarCestaTrabajador(idTrabajador: string) {
    const database = (await conexion).db('tocgame');
    const cesta = database.collection('cestas');
    const resultado = await cesta.deleteMany({ idTrabajador: idTrabajador });
    console.log(resultado)
    return resultado;
}

export async function eliminarCesta(nombre: string) {
    const database = (await conexion).db('tocgame');
    const cesta = database.collection('cestas');
    const resultado = await cesta.deleteMany({ _id: nombre.toString() });
    return resultado;
}

export async function eliminarCestaByIdTrabajador(idTrabajador: number) {
    const database = (await conexion).db('tocgame');
    const cesta = database.collection('cestas');
    const resultado = await cesta.deleteMany({ idTrabajador: idTrabajador });
    return resultado;
}

export async function updateIdCestaTrabajador(id: number) {
    const database = (await conexion).db('tocgame');
    const cesta = database.collection('cestas');
    const resTemp = await cesta.findOne({ nombreCesta: id.toString() });
    resTemp._id = id;
    resTemp.nombreCesta = `Trabajador ${id}`
    const resultado = await cesta.insertOne(resTemp);
    await cesta.deleteMany({ nombreCesta: id.toString() });
    return resultado;
}

// export async function updateIdCestaTrabajadorMesas(id: string, idCesta: number) {
//     console.log('updateIdCestaTrabajador')
//     console.log(id)
//     console.log(idCesta)
//     const database = (await conexion).db('tocgame');
//     const cesta = database.collection('cestas');
//      const mesa = await cesta.findOne({ _id: idCesta });
//      console.log('La lista de las mesas ------------------------------------------')
//      console.log(mesa.lista)
//     // resTemp._id = id;
//     const resultado = await cesta.updateOne({ _id: `${id}` }, { $set: { lista: mesa.lista  } });
//     const cestaTrabajadors = await cesta.findOne({ _id: `${id}` });
//     console.log('--------------------------')
//     console.log(cestaTrabajadors)
//     console.log('El resultado del update ------------------------------------------')

//   console.log(resultado)
//     return resultado;
// }
export async function getAllCestas(): Promise<any> {
    const database = (await conexion).db('tocgame');
    const cesta = database.collection('cestas');
    const resultado = await (await cesta.find()).toArray();
    
    return resultado;
}

/* Esto es mentira, no borra la cesta. */
export async function borrarCesta(idCesta: number) {
    const database = (await conexion).db('tocgame');
    const cesta = database.collection('cestas');
    const tiposIva = {
        base1: 0,
        base2: 0,
        base3: 0,
        valorIva1: 0,
        valorIva2: 0,
        valorIva3: 0,
        importe1: 0,
        importe2: 0,
        importe3: 0,
    }
    const resultado = await cesta.updateOne({ _id: idCesta }, { $set: { 'lista': [], 'tiposIva': tiposIva } }, { upsert: true });
    return resultado;
}

/* Reemplaza una cesta o la crea nueva si no existe */
export async function setCesta(cesta: CestasInterface) {
    const database = (await conexion).db('tocgame');
    const unaCesta = database.collection('cestas');
    const resultado = await unaCesta.replaceOne({_id: cesta._id}, {
        tiposIva: cesta.tiposIva,
        lista: cesta.lista,
        nombreCesta: (cesta.nombreCesta != undefined || cesta.nombreCesta != '') ? (cesta.nombreCesta) : ('PRINCIPAL'),
        regalo: (cesta.regalo != undefined) ? (cesta.regalo): (false),
        idTrabajador: cesta.idTrabajador
    }, {upsert: true});
    
    return resultado;
}

export async function getCestaDiferente(id_cesta: string) {
    const database = (await conexion).db('tocgame');
    const cestas = database.collection('cestas');
    const resultado = await cestas.findOne({ _id: { $ne: id_cesta }, nombreCesta: { $ne: 'PRINCIPAL' }});
    return resultado;
}