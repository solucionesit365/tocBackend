export interface TrabajadoresInterface {
    _id: number,
    idTrabajador: number,
    nombre: string,
    nombreCorto: string,
    fichado: boolean
}

export interface SincroFichajesInterface {
    _id: number,
    infoFichaje: {
        idTrabajador: number,
        fecha: {
            year: number,
            month: number,
            day: number,
            hours: number,
            minutes: number,
            seconds: number
        }
    },
    tipo: "ENTRADA" | "SALIDA",
    enviado: boolean,
    enTransito: boolean,
    intentos: number,
    comentario: string,
    idPlan: string
}

export const trabajadorVacio = {
    _id: -1,
    idTrabajador: -1,
    nombre: '',
    nombreCorto: '',
    fichado: false
}