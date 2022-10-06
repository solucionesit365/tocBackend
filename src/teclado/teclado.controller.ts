import {Controller, Post, Body} from '@nestjs/common';
import { UtilesModule } from 'src/utiles/utiles.module';
import {cestasInstance} from '../cestas/cestas.clase';
import {tecladoInstance} from './teclado.clase';


@Controller('teclado')
export class TecladoController {
  /* Eze 4.0 */
  @Post("clickTeclaArticulo")
  async clickTeclaArticulo(
    @Body()
    {
      idArticulo,
      aPeso,
      gramos,
      idCesta,
      unidades,
      idCliente,
      arraySuplementos,
    }
  ) {
    try {
      if (
        UtilesModule.checkVariable(idArticulo, aPeso, gramos, idCesta, unidades)
      ) {
        return await cestasInstance.clickTeclaArticulo(
          idArticulo,
          gramos,
          idCesta,
          unidades,
          idCliente,
          arraySuplementos
        );
      }
      throw Error("Faltan datos en cestas (controller) > clickTeclaArticulo");
    } catch (err) {
      console.log(err);
      return false;
    }
  }
    @Post('actualizarTeclado')
    actualizarArticulos() {
      return tecladoInstance.actualizarTeclado();
    }
    @Post('cambiarPosTecla')
    cambiarPosTecla(@Body() params) {
      if (params.idArticle && params.nuevaPos && params.nombreMenu) {
        return tecladoInstance.cambiarPosTecla(params.idArticle, params.nuevaPos, params.nombreMenu).then((res) => {
          if (res) {
            return {error: false, info: res};
          }
          return {error: true, mensaje: 'Error en teclado/cambiarPosTecla'};
        });
      } else {
        return {error: true, mensaje: 'Faltan datos en teclado/cambiarPosTecla'};
      }
    }
}
