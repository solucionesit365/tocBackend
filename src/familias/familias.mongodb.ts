import { conexion } from "../conexion/mongodb";

export async function insertarFamilias(arrayFamilias) {
    const database = (await conexion).db('tocgame');
    const familias = database.collection('familias');
    const resultado = await familias.insertMany(arrayFamilias);
    return resultado;
}
