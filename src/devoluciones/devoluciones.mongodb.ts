import { conexion } from "../conexion/mongodb";
import { DevolucionesInterface } from "./devoluciones.interface";

export async function insertarDevolucion(data: any) {
    const database = (await conexion).db('tocgame');
    const devoluciones = database.collection('devoluciones');
    const resultado = await devoluciones.insertOne(data);
    return resultado;
}

export async function getDevolucionMasAntigua() {
    const database = (await conexion).db('tocgame');
    const devolucion = database.collection('devoluciones');
    const resultado = await devolucion.findOne({ enviado: false }, { sort: {timestamp: 1} } );
    return resultado;
}

export async function actualizarEstadoDevolucion(devolucion: DevolucionesInterface) {
    const database = (await conexion).db('tocgame');
    const sincroFichajes = database.collection('devoluciones');
    const resultado = await sincroFichajes.updateOne({ _id: devolucion._id }, { $set: {
        "enviado": devolucion.enviado,
        "intentos": devolucion.intentos,
        "comentario": devolucion.comentario
    }});
    return resultado;
}

export async function getDevolucionByID(id: number) {
    const database = (await conexion).db('tocgame');
    const devoluciones = database.collection('devoluciones');
    const resultado = devoluciones.findOne({ _id: id });
    return resultado;
}
