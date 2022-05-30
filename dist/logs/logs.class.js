"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogsClass = void 0;
const mongodb_1 = require("../conexion/mongodb");
class LogsClass {
    static newLog(dato1, dato2) {
        mongodb_1.conexion.then((conexionInstance) => {
            const database = conexionInstance.db('tocgame');
            const logs = database.collection('logs');
            logs.insertOne({ dato1, dato2 });
        }).catch((err) => {
            console.log(err);
        });
    }
}
exports.LogsClass = LogsClass;
//# sourceMappingURL=logs.class.js.map