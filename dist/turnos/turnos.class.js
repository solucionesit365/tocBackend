"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TurnosClass = void 0;
const axios_1 = require("axios");
const parametros_clase_1 = require("../parametros/parametros.clase");
const trabajadores_clase_1 = require("../trabajadores/trabajadores.clase");
class TurnosClass {
    getPlanes() {
        return axios_1.default.post("turnos/getPlanes", parametros_clase_1.parametrosInstance.getParametros()).then((res) => {
            if (res.data.error == false) {
                return this.eliminarUtilizados(res.data.info).then((arrayLimpioPlanes) => {
                    return { error: false, info: arrayLimpioPlanes };
                }).catch((err) => {
                    console.log(err);
                    return { error: true, mensaje: 'Error: Backend. turnos/getPlanes > eliminarUtilizados CATCH' };
                });
            }
            return { error: true, mensaje: res.data.mensaje };
        }).catch((err) => {
            console.log(err);
            return { error: true, mensaje: 'Error: Backend. /turnos/getPlanes CATCH' };
        });
    }
    async eliminarUtilizados(arrayPlanes) {
        let arrayLimpioPlanes = [];
        for (let i = 0; i < arrayPlanes.length; i++) {
            if (await trabajadores_clase_1.trabajadoresInstance.existePlan(arrayPlanes[i].idPlan) == false) {
                arrayLimpioPlanes.push(arrayPlanes[i]);
            }
        }
        return arrayLimpioPlanes;
    }
}
exports.TurnosClass = TurnosClass;
//# sourceMappingURL=turnos.class.js.map