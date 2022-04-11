import axios from "axios";
import { parametrosInstance } from "src/parametros/parametros.clase";
import { trabajadoresInstance } from "src/trabajadores/trabajadores.clase";
import { TurnosInterface } from "./turnos.interface";

export class TurnosClass {
    getPlanes(): Promise<{error: boolean, info: any;} | {error: boolean, mensaje: string}> {
        return axios.post("turnos/getPlanes", parametrosInstance.getParametros()).then((res: any) => {
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
            return { error: true, mensaje: 'Error: Backend. /turnos/getPlanes CATCH' }
        });
    }

    async eliminarUtilizados(arrayPlanes: TurnosInterface[]): Promise<TurnosInterface[]> {
        let arrayLimpioPlanes: TurnosInterface[] = [];
        for (let i = 0; i < arrayPlanes.length; i++) {
            if (await trabajadoresInstance.existePlan(arrayPlanes[i].idPlan) == false) {
                arrayLimpioPlanes.push(arrayPlanes[i]);
            }
        }
        return arrayLimpioPlanes;
    }
}
