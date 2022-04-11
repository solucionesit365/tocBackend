import { Controller, Get } from '@nestjs/common';
import { parametrosInstance } from 'src/parametros/parametros.clase';
@Controller('getInfo')
export class VersionController {
    @Get('tocGame')
    getInfo() {
        const parametros = parametrosInstance.getParametros();
        return { 
            version: process.env.npm_package_version,
            nombreTienda: parametros.nombreTienda
         };
    }
}