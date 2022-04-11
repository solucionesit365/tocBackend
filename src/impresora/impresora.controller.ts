import { Controller, Post, Body } from '@nestjs/common';
import { impresoraInstance } from './impresora.class';

@Controller('impresora')
export class ImpresoraController {
    @Post('imprimirTicket')
    imprimirTicket(@Body() params) {
        const idTicket: number = params.idTicket;
        impresoraInstance.imprimirTicket(idTicket);
    }

    @Post('abrirCajon')
    abrirCajon() {
        impresoraInstance.abrirCajon();
    }

    @Post('imprimirEntregas')
    imprimirEntregas() {
        return impresoraInstance.imprimirEntregas();
    }
}
