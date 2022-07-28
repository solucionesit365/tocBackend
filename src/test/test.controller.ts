import {Body, Controller, Post} from '@nestjs/common';
import {ticketsInstance} from 'src/tickets/tickets.clase';


@Controller('test')
export class TestController {
    @Post('test')
  imprimirAlgo(@Body() parms) {
    return ticketsInstance.anularTicket(2);
  }
}
