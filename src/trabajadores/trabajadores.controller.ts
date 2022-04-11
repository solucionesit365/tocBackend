import { Body, Controller, Post, Get } from '@nestjs/common';
import { trabajadoresInstance } from './trabajadores.clase';
import { UtilesModule } from '../utiles/utiles.module';
import { parametrosInstance } from '../parametros/parametros.clase';
import axios from 'axios';

@Controller('trabajadores')
export class TrabajadoresController {
    @Post('getTrabajadoresFichados')
    getTrabajadoresFichados() {
        return trabajadoresInstance.getTrabajadoresFichados().then((res) => {
            if (res.length > 0) {
                return {
                    error: false,
                    res: res
                }
            } else {
                return {
                    error: false,
                    res: []
                }
            }
        }).catch((err) => {
            console.log(err);
            return {
                error: true
            }
        });
    }

    @Post('setActivo')
    setTrabajadorActivo(@Body() params) {
        if(params.id) {
            return trabajadoresInstance.setCurrentTrabajadorPorNombre(params.id).then((res) => {
                if (res) {
                    return {
                        error: false,
                    }
                } else {
                    return { error: true };
                }
            }).catch((err) => {
                console.log(err);
                return { error: true };
            });
        }
    }

    @Post('getCurrentTrabajador')
    getCurrentTrabajador() {
        return trabajadoresInstance.getCurrentTrabajador().then((res) => {
            if (res != null) {
                return { error: false, trabajador: res };
            } else {
                return { error: true };
            }
        }).catch((err) => {
            console.log(err);
            return { error: true };
        });
    }
    @Get('getCurrentTrabajadorNueva')
    getCurrentTrabajadorr() {
        return trabajadoresInstance.getCurrentTrabajador().then((res) => {
            if (res != null) {
                return { error: false, trabajador: res }
            } else {
                return { error: true };
            }
        }).catch((err) => {
            console.log(err);
            return { error: true };
        });
    }

    @Post('buscar')
    buscar(@Body() params) {
        return trabajadoresInstance.buscar(params.busqueda);
    }

    @Post('fichar')
    fichar(@Body() params) {
        if (params.idTrabajador != undefined && params.idPlan != undefined && params.idPlan != null) {
            return trabajadoresInstance.ficharTrabajador(params.idTrabajador, params.idPlan).then((res) => {
                if (res) {
                    return { error: false };
                } else {
                    return { error: true, mensaje: 'Error en ficharTrabajador()' };
                }
            }).catch((err) => {
                console.log(err);
                return { error: true, mensaje: 'Error, mirar consola nest' };
            });
        } else {
            return { error: true, mensaje: 'Backend: Faltan datos en trabajadores/fichar' };
        }
    }

    @Post('desfichar')
    desfichar(@Body() params) {
        return trabajadoresInstance.desficharTrabajador(params.idTrabajador).then((res) => {
            if (res) {
                return { error: false };
            } else {
                return { error: true, mensaje: 'Error en desficharTrabajador()' };
            }
        }).catch((err) => {
            console.log(err);
            return { error: true, mensaje: 'Error, mirar consola nest' };
        });
    }
    @Post('actualizarTrabajadores')
    actualizarTrabajadores() {
        return trabajadoresInstance.actualizarTrabajadores().then((res) => {
            console.log(res);
            return res;
        }).catch((err) => {
            console.log(err);
            return { error: true, mensaje: 'Backend: Error en trabajadores/actualizarTrabajadores CATCH' }
        });
    }

    @Post('crearPlan')
    crearPlan(@Body() params) {
        if (UtilesModule.checkVariable(params.horaEntrada, params.horaSalida)) {
            const parametros = parametrosInstance.getParametros();
            return axios.post('dependientas/crearPlan', {
                parametros,
                horaEntrada: params.horaEntrada,
                horaSalida: params.horaSalida
            }).then((res: any) => {
                if (res.data.error == false) {
                    return { error: false };
                } else {
                    return { error: true, mensaje: res.data.mensaje };
                }
            }).catch((err) => {
                console.log(err);
                return { error: true, mensaje: 'Error en backend crearPlan CATCH' };
            });
        } else {
            return { error: true, mensaje: 'Error, faltan datos trabajadores/crearPlan' };
        }
    }

    @Get('getTrabajaronAyer')
    getTrabajaronAyer() {
        return trabajadoresInstance.getTrabajaronAyer();
    }
    @Post('guardarHorasExtraCoordinacion')
    guardarHorasExtraCoordinacion(@Body() params) {
        if (UtilesModule.checkVariable(params.horasExtra, params.horasCoordinacion, params.idTrabajador, params.timestamp)) {
            return trabajadoresInstance.guardarHorasExtraCoordinacion(params.horasExtra, params.horasCoordinacion, params.idTrabajador, params.timestamp).then((res) => {
                return res;
            }).catch((err) => {
                console.log(err);
            });
        } else {
            return { error: true, mensaje: 'Backend: Error faltan datos en trabajadores/guardarHorasExtrCoordinacion'};
        }
    }
}
