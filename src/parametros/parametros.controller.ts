import { Body, Controller, Post, Get } from '@nestjs/common';
import { parametrosInstance } from "./parametros.clase";
@Controller('parametros')
export class ParametrosController {
    @Post('todoInstalado')
    todoInstalado() {
        const res = parametrosInstance.todoInstalado();
        if (res) {
            const respuestaParametros = parametrosInstance.getParametros();
            return {
                todoInstalado: res,
                config: respuestaParametros
            };
        } else {
            return { todoInstalado: false };
        }
    }

    @Post('getParametros')
    getParametros() {
        const parametros = parametrosInstance.getParametros();
        return { error: false, parametros };      
    }

    @Get('getParametrosBonito')
    getParametrosBonito() {
        const parametros = parametrosInstance.getParametros();
        return { error: false, parametros };      
    }

    @Post('vidAndPid')
    vidAndPid(@Body() params) {
        if (params != undefined || params != null) {
            if (params.vid != undefined || params.vid != null || params.pid != undefined || params.pid != null) {
                return parametrosInstance.setVidAndPid(params.vid, params.pid).then((res) => {
                    if (res) {
                        return { error: false };
                    } else {
                        return { error: true, mensaje: 'Backend: parametros/vidAndPid setVidAndPid no se ha podido guardar' };
                    }
                }).catch((err) => {
                    console.log(err);
                    return { error: true, mensaje: 'Backend: parametros/vidAndPid setVidAndPid catch' };
                });
            } else {
                return { error: true, mensaje: 'Backend: parametros/vidAndPid faltan datos' };
            }
        } else {
            return { error: true, mensaje: 'Backend: parametros/vidAndPid faltan todos los datos' };
        }
    }

    @Get('getVidAndPid')
    getVidAndPid() {
        return parametrosInstance.getEspecialParametros().then((res) => {
            if (res.impresoraUsbInfo != undefined || res.impresoraUsbInfo != null) {
                return { error: false, info: res };
            } else {
                return { error: false, info: {
                    impresoraUsbInfo: {
                        vid: '',
                        pid: ''
                    }
                } };
            }
        }).catch((err) => {
            console.log(err);
            return { error: true, mensaje: 'Backend: Error en getVidAndPid CATCH' };
        }); 
    }
    @Post('setIpPaytef')
    setIpPaytef(@Body() params) {
        if (params != undefined || params != null) {
            if (params.ip != undefined || params.ip != null) {
                return parametrosInstance.setIpPaytef(params.ip).then((res) => {
                    if (res) {
                        return { error: false };
                    } else {
                        return { error: true, mensaje: 'Backend: parametros/setIpPaytef setIpPaytef no se ha podido guardar' };
                    }
                }).catch((err) => {
                    console.log(err);
                    return { error: true, mensaje: 'Backend: parametros/setIpPaytef setIpPaytef catch' };
                });
            } else {
                return { error: true, mensaje: 'Backend: parametros/setIpPaytef faltan datos' };
            }
        } else {
            return { error: true, mensaje: 'Backend: parametros/setIpPaytef faltan todos los datos' };
        }
    }

    @Get('getIpPaytef')
    getIpPaytef() {
        return parametrosInstance.getEspecialParametros().then((res) => {
            if (res.ipTefpay != undefined || res.ipTefpay != null) {
                return { error: false, info: res.ipTefpay };
            } else {
                return { error: false, info: '' };
            }
        }).catch((err) => {
            console.log(err);
            return { error: true, mensaje: 'Backend: Error en getIpPaytef CATCH' };
        }); 
    }

}
