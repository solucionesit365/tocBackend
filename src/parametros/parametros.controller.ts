import { Body, Controller, Post, Get, ConsoleLogger } from '@nestjs/common';
import { parametrosInstance } from "./parametros.clase";
import { ParametrosInterface } from './parametros.interface';
import axios from 'axios';
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
    
    @Post('actualizarParametros')
        async actualizarParametros() {
            let licencia = await parametrosInstance.getlicencia()
//const licencia =  await parametrosInstance.getParametros().licencia;
        return axios.post('parametros/getParametros', {
            numLlicencia:licencia
        }).then((res: any) => {
            if (!res.data.error) {
                
              let paramstpv=  res.data.info
              return parametrosInstance.setParametros(paramstpv).then((res2) => {
                 if (res2) {
                 return { error: false };
                    } else {
                        return { error: true, mensaje: 'Backend: Error en instalador/pedirDatos > setParametros'};
                    }
                }).catch((err) => {
                    console.log(err);
                    return  { error: true, mensaje: 'Backend: No se ha podido setear parametros' };
                });
            } else {
                return { error: true, mensaje: res.data.mensaje };
            }
        }).catch((err) => {
            console.log(err);
            return { error: true, mensaje: 'Error en pedir parametros/instaladorLicencia de sanPedro' };
        });
 
    }

    @Get('getParametrosBonito')
    getParametrosBonito() {
        const parametros = parametrosInstance.getParametros();
        return { error: false, parametros };      
    }

    @Post('vidAndPid')
    vidAndPid(@Body() params) {
        console.log(params)
        if (params != undefined || params != null) {
            if (params.vid != undefined || params.vid != null || params.pid != undefined || params.pid != null || params.com != undefined || params.com != null) {
                return parametrosInstance.setVidAndPid(params.vid, params.pid, params.com).then((res) => {
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
