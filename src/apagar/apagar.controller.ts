import { Controller, Post, Body,Get} from '@nestjs/common';
import { apagarinstance } from './apagar.class';

@Controller('apagarEquipo')
export class ApagarController {
    @Get()
    apagar() {
        
       return  apagarinstance.apagarEquipo();
    }
    

    
}
