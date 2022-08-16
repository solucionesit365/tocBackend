import { trabajadoresInstance } from "src/trabajadores/trabajadores.clase";
import { TrabajadoresInterface } from "src/trabajadores/trabajadores.interface";

export class DoctorClass {
    async checkTrabajadores() {
        try {
            const trabajadores: TrabajadoresInterface[] = await trabajadoresInstance.getTrabajadoresFichados();
            for (let i = 0; i < trabajadores.length; i++) {
                if (trabajadores[i].idCesta === undefined) {
                    return false;
                }
            }
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    }
    async checkCestas() {
        try {
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    }
}
export const doctorInstance = new DoctorClass();