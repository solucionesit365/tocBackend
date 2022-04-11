"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trabajadoresInstance = exports.TrabajadoresClase = void 0;
const schTrabajadores = require("./trabajadores.mongodb");
const parametros_clase_1 = require("../parametros/parametros.clase");
const axios_1 = require("axios");
const cestas_clase_1 = require("../cestas/cestas.clase");
class TrabajadoresClase {
    buscar(busqueda) {
        return schTrabajadores.buscar(busqueda).then((res) => {
            if (res.length > 0) {
                return res;
            }
            else {
                return [];
            }
        }).catch((err) => {
            console.log(err);
            return [];
        });
    }
    mantenerTrabajadoresFichados(nuevoArray) {
        return this.getFichados().then((arrayFichados) => {
            for (let i = 0; i < arrayFichados.length; i++) {
                for (let j = 0; j < nuevoArray.length; j++) {
                    if (arrayFichados[i]._id == nuevoArray[j]._id) {
                        nuevoArray[j]["fichado"] = true;
                        break;
                    }
                }
            }
            return { error: false, info: nuevoArray };
        }).catch((err) => {
            console.log(err);
            return { error: true, info: [] };
        });
    }
    actualizarTrabajadores() {
        const params = parametros_clase_1.parametrosInstance.getParametros();
        return axios_1.default.post("dependientas/descargar", { database: params.database }).then((res) => {
            if (res.data.error == false) {
                if (res.data.info.length > 0) {
                    return this.mantenerTrabajadoresFichados(res.data.info).then((resKeep) => {
                        if (resKeep.error == false) {
                            return this.insertarTrabajadores(resKeep.info).then((resInsert) => {
                                if (resInsert) {
                                    return { error: false };
                                }
                                else {
                                    return { error: true, mensaje: 'Backend: Error actualizarTrabajadores ultimo momento' };
                                }
                            }).catch((err) => {
                                console.log(err);
                                return { error: true, mensaje: 'Backend: Error actualizarTrabajadores CATCH' };
                            });
                        }
                        else {
                            return { error: true, mensaje: 'Backend: Error en actualizarTrabajadores/mantenerTrabajadoresFichados normal' };
                        }
                    }).catch((err) => {
                        console.log(err);
                        return { error: true, mensaje: 'Backend: Error en actualizarTrabajadores/mantenerTrabajadoresFichados CATCH' };
                    });
                }
                else {
                    return { error: true, mensaje: 'No hay ningún trabajador en la base de datos para añadir' };
                }
            }
            else {
                return { error: true, mensaje: res.data.error };
            }
        });
    }
    getCurrentIdTrabajador() {
        return schTrabajadores.getCurrentIdTrabajador().then((resultado) => {
            if (resultado != null) {
                return resultado.idCurrentTrabajador;
            }
            else {
                return null;
            }
        }).catch((err) => {
            console.log(err);
            return null;
        });
        ;
    }
    getCurrentTrabajador() {
        return this.getCurrentIdTrabajador().then((idCurrentTrabajador) => {
            if (idCurrentTrabajador != null) {
                return this.getTrabajador(idCurrentTrabajador);
            }
            else {
                return null;
            }
        }).catch((err) => {
            console.log(err);
            return null;
        });
    }
    setCurrentTrabajador(idTrabajador) {
        return schTrabajadores.setCurrentIdTrabajador(idTrabajador).then((res) => {
            if (res.acknowledged) {
                parametros_clase_1.parametrosInstance.actualizarParametros();
                return true;
            }
            else {
                return false;
            }
            ;
        }).catch((err) => {
            console.log(err);
            return false;
        });
    }
    setCurrentTrabajadorPorNombre(id) {
        id = parseInt(id);
        return schTrabajadores.setCurrentIdTrabajador(id).then((res) => {
            if (res.acknowledged) {
                parametros_clase_1.parametrosInstance.actualizarParametros();
                return true;
            }
            else {
                console.log(123);
                return false;
            }
            ;
        }).catch((err) => {
            console.log(err);
            return false;
        });
    }
    getTrabajadoresFichados() {
        return schTrabajadores.getTrabajadoresFichados();
    }
    getTrabajador(idTrabajador) {
        return schTrabajadores.getTrabajador(idTrabajador);
    }
    ficharTrabajador(idTrabajador, idPlan) {
        return schTrabajadores.ficharTrabajador(idTrabajador).then((res) => {
            if (res.acknowledged) {
                return this.setCurrentTrabajador(idTrabajador).then((resSetCurrent) => {
                    if (resSetCurrent) {
                        return this.nuevoFichajesSincro("ENTRADA", idTrabajador, idPlan).then((res2) => {
                            if (res2.acknowledged) {
                                cestas_clase_1.cestas.crearNuevaCesta(idTrabajador.toString()).then((data) => {
                                    cestas_clase_1.cestas.updateIdCestaTrabajador(idTrabajador.toString());
                                });
                                return true;
                            }
                            else {
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
            }
            else {
                return false;
            }
        }).catch((err) => {
            console.log(err);
            return false;
        });
    }
    desficharTrabajador(idTrabajador) {
        return schTrabajadores.desficharTrabajador(idTrabajador).then((res) => {
            if (res.acknowledged) {
                return this.nuevoFichajesSincro("SALIDA", idTrabajador, '').then((res2) => {
                    if (res2.acknowledged) {
                        cestas_clase_1.cestas.eliminarCesta(idTrabajador).then((res) => {
                            console.log(res);
                        });
                        return true;
                    }
                    else {
                        console.log(123);
                        return false;
                    }
                }).catch((err) => {
                    console.log(err);
                    return false;
                });
            }
            else {
                console.log(432);
                return false;
            }
        }).catch((err) => {
            console.log(err);
            return false;
        });
    }
    nuevoFichajesSincro(tipo, idTrabajador, idPlan) {
        const auxTime = new Date();
        const objGuardar = {
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
    getFichados() {
        return schTrabajadores.buscarTrabajadoresFichados().then((arrayFichados) => {
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
    actualizarEstadoFichaje(fichaje) {
        return schTrabajadores.actualizarEstadoFichaje(fichaje).then((res) => {
            return res.acknowledged;
        }).catch((err) => {
            console.log(err);
            return false;
        });
    }
    existePlan(idPlan) {
        return schTrabajadores.existePlan(idPlan).then((res) => {
            if (res != null) {
                return true;
            }
            return false;
        }).catch((err) => {
            console.log(err);
            return true;
        });
    }
    getInicioFinalDiaAnterior() {
        const ayer = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
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
                arrayTrabajadores.push({ infoTrabajador: await this.getTrabajador(idsAyer[i].infoFichaje.idTrabajador), timestamp: idsAyer[i]._id });
            }
            console.log("lool:", arrayTrabajadores);
            const parametros = parametros_clase_1.parametrosInstance.getParametros();
            return axios_1.default.post('turnos/getHorasExtraCoordinacion', {
                parametros: parametros,
                arrayTrabajaronAyer: arrayTrabajadores,
                ayer: infoTime.finalTime
            }).then((res) => {
                if (res.data.error == false) {
                    return res.data.info;
                }
                else {
                    console.log(res.data.mensaje);
                }
            }).catch((err) => {
                console.log(err);
                return [];
            });
        }
        catch (err) {
            console.log(err);
            return [];
        }
    }
    async guardarHorasExtraCoordinacion(horasExtra, horasCoordinacion, idTrabajador, timestamp) {
        return axios_1.default.post('turnos/guardarHorasExtraCoordinacion', {
            horasExtra,
            horasCoordinacion,
            idEmpleado: idTrabajador,
            fechaFichaje: timestamp,
            parametros: parametros_clase_1.parametrosInstance.getParametros()
        }).then((res) => {
            if (res.data.error == false) {
                return { error: false };
            }
            else {
                return { error: true, mensaje: res.data.mensaje };
            }
        }).catch((err) => {
            console.log(err);
            return { error: true, mensaje: 'Error Backend: trabajadores/guardarHorasExtraCoordinacion' };
        });
    }
}
exports.TrabajadoresClase = TrabajadoresClase;
exports.trabajadoresInstance = new TrabajadoresClase();
//# sourceMappingURL=trabajadores.clase.js.map