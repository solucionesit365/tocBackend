import { Controller, Post, Body } from '@nestjs/common';
// import { socket } from '../sanPedro';
import { ticketsInstance } from 'src/tickets/tickets.clase';
import { parametrosInstance } from 'src/parametros/parametros.clase';

@Controller('pruebas')
export class PruebasController {
    @Post('test')
    test(@Body() params) {

    }
}
