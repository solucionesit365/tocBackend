import {Controller, Post, Body} from '@nestjs/common';
import {impresoraInstance} from './impresora.class';

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

<<<<<<< HEAD
    @Post('imprimircaja')
    imprimircaja(@Body() params) {
      console.log( params.caja)
      return impresoraInstance.imprimirCaja(params.caja.calaixFetZ,params.caja.idDependienta, params.caja.descuadre, params.caja.nClientes,  params.caja.recaudado, params.caja.movimientos, 'T-000', params.caja.inicioTime, params.caja.finalTime, params.caja.infoExtra.cambioInicial, params.caja.infoExtra.cambioFinal, null)

=======
    @Post('imprimirCaja')
    imprimirCaja(@Body() params) {
      console.log(params.caja)
      return impresoraInstance.imprimirCaja(params.caja.calaixFetZ,params.caja.idDependienta, params.caja.descuadre, params.caja.nClientes,  params.caja.recaudados, params.caja.movimientos, 'T-000', params.caja.inicioTime, params.caja.finalTime, params.caja.infoExtra.cambioInicial, params.caja.infoExtra.cambioFinal, null)
>>>>>>> 5137503ccc8888393626b5df8b0893642e234c10
    }
    
    @Post('despedida')
    despedircliente() {
      impresoraInstance.despedircliente();
    }
    @Post('bienvenida')
    binvenidacliente() {
      impresoraInstance.binvenidacliente();
    }
}
