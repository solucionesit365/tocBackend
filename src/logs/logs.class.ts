import { conexion } from "../conexion/mongodb";

export class LogsClass {
    static newLog(dato1: any, dato2: any) {
        conexion.then((conexionInstance) => {
            const database = conexionInstance.db('tocgame');
            const logs = database.collection('logs');
            logs.insertOne({ dato1, dato2 });
        }).catch((err) => {
            console.log(err);
        });
    }
}
