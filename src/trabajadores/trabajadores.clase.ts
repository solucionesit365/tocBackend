// 100%
import { globalInstance } from "../global/global.clase";
import { socket } from "../conexion/socket";
import { SincroFichajesInterface, TrabajadoresInterface } from "./trabajadores.interface";
import * as schTrabajadores from "./trabajadores.mongodb";
import { parametrosInstance } from "../parametros/parametros.clase";
import axios from "axios";
import { cestas } from "../cestas/cestas.clase";

export class TrabajadoresClase {

    buscar(busqueda: string) {
        return schTrabajadores.buscar(busqueda).then((res: TrabajadoresInterface[]) => {
            if (res.length > 0) {
                return res;
            } else {
                return [];
            }
        }).catch((err) => {
            console.log(err);
            return [];
        });
    }

    mantenerTrabajadoresFichados(nuevoArray: TrabajadoresInterface[]) {
        return this.getFichados().then((arrayFichados) => {
            for (let i = 0; i < arrayFichados.length; i++) {
                for (let j = 0; j < nuevoArray.length; j++) {
                    if (arrayFichados[i]._id == nuevoArray[j]._id) {
                        nuevoArray[j]["fichado"] = true;
                        break;
                    }
                }
            }
            return { error: false, info: nuevoArray }
        }).catch((err) => {
            console.log(err);
            return { error: true, info: [] };
        });
    }

    actualizarTrabajadores() {
        // globalInstance.setStopNecesario(true);
        const params = parametrosInstance.getParametros();
        // socket.emit('descargar-trabajadores', { licencia: params.licencia, database: params.database, codigoTienda: params.codigoTienda});
        return axios.post("dependientas/descargar", { database: params.database }).then((res: any) => {
            if (res.data.error == false) {
                if (res.data.info.length > 0) {
                    return this.mantenerTrabajadoresFichados(res.data.info).then((resKeep) => {
                        if (resKeep.error == false) {
                            return this.insertarTrabajadores(resKeep.info).then((resInsert) => {
                                if (resInsert) {
                                    return { error: false };
                                } else {
                                    return { error: true, mensaje: 'Backend: Error actualizarTrabajadores ultimo momento' }
                                }
                            }).catch((err) => {
                                console.log(err);
                                return { error: true, mensaje: 'Backend: Error actualizarTrabajadores CATCH' };
                            });
                        } else {
                            return { error: true, mensaje: 'Backend: Error en actualizarTrabajadores/mantenerTrabajadoresFichados normal' };
                        }
                    }).catch((err) => {
                        console.log(err);
                        return { error: true, mensaje: 'Backend: Error en actualizarTrabajadores/mantenerTrabajadoresFichados CATCH' };
                    });
                } else {
                    return { error: true, mensaje: 'No hay ningún trabajador en la base de datos para añadir' };
                }
            } else {
                return { error: true, mensaje: res.data.error };
            }
        });
    }

    getCurrentIdTrabajador(): Promise<number> {
        return schTrabajadores.getCurrentIdTrabajador().then((resultado) => {
            if (resultado != null) {
                return resultado.idCurrentTrabajador;
            } else {
                return null;
            }
        }).catch((err) => {
            console.log(err);
            return null;
        });;
    }

    getCurrentTrabajador(): Promise<TrabajadoresInterface> {
        return this.getCurrentIdTrabajador().then((idCurrentTrabajador) => {
            if (idCurrentTrabajador != null) {
                return this.getTrabajador(idCurrentTrabajador);
            } else {
                return null;
            }
        }).catch((err) => {
            console.log(err);
            return null;
        });
    }

    setCurrentTrabajador(idTrabajador: number): Promise<boolean> {
        return schTrabajadores.setCurrentIdTrabajador(idTrabajador).then((res) => {
            if (res.acknowledged) {
                parametrosInstance.actualizarParametros();
                return true;
            } else {
                return false;
            };
        }).catch((err) => {
            console.log(err);
            return false;
        });
    }

    setCurrentTrabajadorPorNombre(id: any): Promise<boolean> {
        id = parseInt(id);
        return schTrabajadores.setCurrentIdTrabajador(id).then((res) => {
            if (res.acknowledged) {
                parametrosInstance.actualizarParametros();
                return true;
            } else {
                console.log(123);
                return false;
            };
        }).catch((err) => {
            console.log(err);
            return false;
        });
    }

    getTrabajadoresFichados() {
        return schTrabajadores.getTrabajadoresFichados();
    }

    getTrabajador(idTrabajador: number): Promise<TrabajadoresInterface> {
        return schTrabajadores.getTrabajador(idTrabajador);
    }

    /* MongoDB Fichado = false + nuevo item sincro */
    ficharTrabajador(idTrabajador: number, idPlan: string): Promise<boolean> {
        return schTrabajadores.ficharTrabajador(idTrabajador).then((res) => {
            if (res.acknowledged) {
                return this.setCurrentTrabajador(idTrabajador).then((resSetCurrent) => {
                    if (resSetCurrent) {
                        return this.nuevoFichajesSincro("ENTRADA", idTrabajador, idPlan).then((res2) => {
                            if (res2.acknowledged) {
                                cestas.crearNuevaCesta(idTrabajador.toString()).then((data) => {
                                    cestas.updateIdCestaTrabajador(idTrabajador.toString());
                                });
                                return true;
                            } else {
                                return false;
                            }
                        }).catch((err) => {
                            console.log(err);
                            return false;
                        });
                    }
                    return false;
                }).catch((err) => {
                    console.log(err);
                    return false;
                });
            } else {
                return false;
            }
        }).catch((err) => {
            console.log(err);
            return false;
        });
    }

    /* MongoDB Fichado = false + nuevo item sincro */
    desficharTrabajador(idTrabajador: number): Promise<boolean> {
        return schTrabajadores.desficharTrabajador(idTrabajador).then((res) => {
            if (res.acknowledged) {
                return this.nuevoFichajesSincro("SALIDA", idTrabajador, '').then((res2) => {
                    if (res2.acknowledged) {
                        cestas.eliminarCesta(idTrabajador).then((res) => {
                            console.log(res)
                        });
                        return true;
                    } else {
                        console.log(123);
                        return false;
                    }
                }).catch((err) => {
                    console.log(err);
                    return false;
                });
            } else {
                console.log(432);
                return false;
            }
        }).catch((err) => {
            console.log(err);
            return false;
        });
    }

    /* Inserta en el sincro un nuevo movimiento de fichaje */
    nuevoFichajesSincro(tipo: "ENTRADA" | "SALIDA", idTrabajador: number, idPlan: string) {
        const auxTime = new Date();
        const objGuardar: SincroFichajesInterface = {
            _id: Date.now(),
            infoFichaje: {
                idTrabajador: idTrabajador,
                fecha: {
                    year: auxTime.getFullYear(),
                    month: auxTime.getMonth(),
                    day: auxTime.getDate(),
                    hours: auxTime.getHours(),
                    minutes: auxTime.getMinutes(),
                    seconds: auxTime.getSeconds()
                }
            },
            tipo: tipo,
            enviado: false,
            enTransito: false,
            intentos: 0,
            comentario: '',
            idPlan: idPlan
        };
        return schTrabajadores.insertNuevoFichaje(objGuardar);
    }

    getFichados(): Promise<TrabajadoresInterface[]> {
        return schTrabajadores.buscarTrabajadoresFichados().then((arrayFichados: TrabajadoresInterface[]) => {
            return arrayFichados;
        }).catch((err) => {
            console.log(err);
            return null;
        });
    }

    insertarTrabajadores(arrayTrabajadores) {
        return schTrabajadores.insertarTrabajadores(arrayTrabajadores).then((res) => {
            return res.acknowledged;
        }).catch((err) => {
            console.log(err);
            return false;
        });
    }

    getFichajeMasAntiguo() {
        return schTrabajadores.getFichajeMasAntiguo();
    }
    
    actualizarEstadoFichaje(fichaje: SincroFichajesInterface) {
        return schTrabajadores.actualizarEstadoFichaje(fichaje).then((res) => {
            return res.acknowledged;
        }).catch((err) => {
            console.log(err);
            return false;
        });
    }

    existePlan(idPlan: string) {
        return schTrabajadores.existePlan(idPlan).then((res) => {
            if (res != null) {
                return true;
            } 
            return false;
        }).catch((err) => {
            console.log(err);
            /* En caso de error, le devuelvo true para eliminar el plan de la lista, para que no se utilice */
            return true;
        });
    }

    /* Devuelve un objeto con la fecha inicial y final del día anterior */
    getInicioFinalDiaAnterior() {
        const ayer = new Date(new Date().getTime() - 24*60*60*1000);
        ayer.setHours(0, 0, 0, 0);
        const inicioTime = ayer.getTime();
        ayer.setHours(23, 59, 59, 999);
        const finalTime = ayer.getTime();
        return { inicioTime, finalTime };
    }

    async getTrabajaronAyer() {
        const infoTime = this.getInicioFinalDiaAnterior();
        try {
            const idsAyer = await schTrabajadores.getTrabajaronAyer(infoTime.inicioTime, infoTime.finalTime);
            let arrayTrabajadores = [];
    
            for (let i = 0; i < idsAyer.length; i++) {
                arrayTrabajadores.push({ infoTrabajador: await this.getTrabajador(idsAyer[i].infoFichaje.idTrabajador), timestamp: idsAyer[i]._id});
            }
            
            console.log("lool:", arrayTrabajadores);

            const parametros = parametrosInstance.getParametros();
            return axios.post('turnos/getHorasExtraCoordinacion', {
                parametros: parametros,
                arrayTrabajaronAyer: arrayTrabajadores,
                ayer: infoTime.finalTime
            }).then((res: any) => {
                if (res.data.error == false) {
                    return res.data.info;
                } else {
                    console.log(res.data.mensaje);
                }
            }).catch((err) => {
                console.log(err);
                return [];
            });
        } catch(err) {
            console.log(err);
            return [];
        }
    }

    async guardarHorasExtraCoordinacion(horasExtra: number, horasCoordinacion: number, idTrabajador: number, timestamp: number) {
        return axios.post('turnos/guardarHorasExtraCoordinacion', {
            horasExtra,
            horasCoordinacion,
            idEmpleado: idTrabajador,
            fechaFichaje: timestamp,
            parametros: parametrosInstance.getParametros()
        }).then((res: any) => {
            if (res.data.error == false) {
                return { error: false };
            } else {
                return { error: true, mensaje: res.data.mensaje };
            }
        }).catch((err) => {
            console.log(err);
            return { error: true, mensaje: 'Error Backend: trabajadores/guardarHorasExtraCoordinacion' };
        })
    }
}

export const trabajadoresInstance = new TrabajadoresClase();
