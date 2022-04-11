import { Controller, Get } from '@nestjs/common';
import axios from 'axios';
import { TurnosClass } from './turnos.class';

@Controller('turnos')
export class TurnosController {
    @Get('getPlanes')
    getPlanes() {
        const turnosInstance = new TurnosClass();
        return turnosInstance.getPlanes().then((res: any) => {
            if (res.error == false) {
                return { error: false, info: res.info };
            }
            return { error: true, mensaje: res.mensaje };
        }).catch((err) => {
            console.log(err);
            return { error: true, mensaje: 'Error: Backend turnos/getPlanes CATCH' };
        });
    }
}
