import { Body, Controller, Post } from '@nestjs/common';
import { UtilesModule } from '../utiles/utiles.module';
import { ofertas } from './promociones.clase';

@Controller('promociones')
export class PromocionesController {
    @Post('setEstadoPromociones')
    setEstadoPromociones(@Body() params) {
        if (UtilesModule.checkVariable(params.estadoPromociones)) {
            ofertas.setEstadoPromociones(params.estadoPromociones);
            return { error: false };
        } else {
            return { error: true, mensaje: 'Error, faltan datos' }
        }
    }
}
