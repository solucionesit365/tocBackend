import { Controller, Get } from '@nestjs/common';
import { transaccionesInstance } from './transacciones.class';

@Controller('transacciones')
export class TransaccionesController {
    @Get('getTest')
    test() {
        console.log(66);
    }
}
