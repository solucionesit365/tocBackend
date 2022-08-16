import { Controller, Get } from '@nestjs/common';
import { doctorInstance } from './doctor.class';

@Controller('doctor')
export class DoctorController {
    @Get('checkTrabajadores')
    checkTrabajadoresDoctor() {
        return doctorInstance.checkTrabajadores();
    }
    @Get('checkCestas')
    checkCestasDoctor() {
        return doctorInstance.checkCestas();
    }
}
