import { Controller, Post, Body } from '@nestjs/common';
import { movimientosInstance } from './movimientos.clase';
@Controller('movimientos')
export class MovimientosController {
    @Post('nuevaSalida')
    nuevaSalida(@Body() params) {
        if (params.cantidad != undefined && params.concepto != undefined) {
            return movimientosInstance.nuevaSalida(params.cantidad, params.concepto, 'SALIDA').then((res) => {
                if (res) {
                    return { error: false };
                } else {
                    return { error: true, mensaje: 'Error en nuevaSalida()' };
                }
            }).catch((err) => {
                console.log(err);
                return { error: true, mensaje: 'Error, ver log nest' };
            });
        } else {
            return { error: true, mensaje: 'Error, faltan datos' };
        }
    }

    @Post('nuevaEntrada')
    nuevaEntrada(@Body() params) {
        if (params.cantidad != undefined && params.concepto != undefined) {
            return movimientosInstance.nuevaEntrada(params.cantidad, params.concepto).then((res) => {
                if (res) {
                    return { error: false };
                } else {
                    return { error: true, mensaje: 'Error en nuevaEntrada()' };
                }
            }).catch((err) => {
                console.log(err);
                return { error: true, mensaje: 'Error, ver log nest' };
            });
        } else {
            return { error: true, mensaje: 'Error, faltan datos' };
        }
    }
}
