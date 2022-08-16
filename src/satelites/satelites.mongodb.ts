import { conexion } from "../conexion/mongodb";

export async function verifyToken(token: string): Promise<any> {
    try {
        const database = (await conexion).db("tocgame");
        const satelites = database.collection("satelites");
        const resultado = await satelites.findOne({ token });
        return resultado;
    } catch (err) {
        console.log(err);
        return false;
    }
}

// export async function addToken(token: string): Promise<any> {
//     try {
//         const database = (await conexion).db("tocgame");
//         const satelites = database.collection("satelites");
//         const resultado = await satelites.insertOne({ token });
//         return resultado;
//     } catch (err) {
//         console.log(err);
//         return false;
//     }
// }
