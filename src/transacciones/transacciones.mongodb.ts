import { ObjectId } from "mongodb";
import { CestasInterface } from "src/cestas/cestas.interface";
import { conexion } from "../conexion/mongodb";
// import { TransaccionesInterface } from "./transacciones.interface";

export async function crearTransaccion(cesta: CestasInterface, total: number, idCliente: string) {
    const database = (await conexion).db('tocgame');
    const transacciones = database.collection('transacciones');
    const resultado = await transacciones.insertOne({
        total: total,
        idCliente: idCliente,
        cesta: cesta,
        pagado: false,
        timestamp: Date.now()
    });
    
    return resultado;
}
export async function getTransaccionById(idTransaccion: string) {
    const database = (await conexion).db('tocgame');
    const transacciones = database.collection('transacciones');
    const resultado = await transacciones.findOne({
        _id: new ObjectId(idTransaccion)
    });
    
    return resultado;
}

export async function getUltimaTransaccion() {
    const database = (await conexion).db('tocgame');
    const transacciones = database.collection('transacciones');
    const resultado = await transacciones.find().sort({_id: -1}).limit(1).toArray();
    return resultado;
}

export async function setPagada(idTransaccion: string) {
    const database = (await conexion).db('tocgame');
    const transacciones = database.collection('transacciones');
    const resultado = await transacciones.updateOne({
        _id: new ObjectId(idTransaccion)
    }, { $set: { 'pagado': false } });
    
    return resultado;
}


