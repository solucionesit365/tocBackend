import { conexion } from "../conexion/mongodb";

export async function setMonedas(data) {
    const database = (await conexion).db('tocgame');
    const monedas = database.collection('monedas');
    const resultado = await monedas.replaceOne({ _id: "INFO_MONEDAS" }, data, {upsert: true});
    
    return resultado;
}