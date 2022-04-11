import { Module } from '@nestjs/common';
import { ArticulosController } from './articulos/articulos.controller';
// import { TeclasMenusController } from './menus/menus.controller';
import { TecladoController } from './teclado/teclado.controller';
import { CestasController } from './cestas/cestas.controller';
import { ParametrosController } from './parametros/parametros.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TicketsController } from './tickets/tickets.controller';
import { TrabajadoresController } from './trabajadores/trabajadores.controller';
import { MenusController } from './menus/menus.controller'; // 100%
import { CajaController } from './caja/caja.controller';
import { ClientesController } from './clientes/clientes.controller';
import { ImpresoraController } from './impresora/impresora.controller';
import { SocketGateway } from './sockets.gateway';
import { DevolucionesController } from './devoluciones/devoluciones.controller';
import { MovimientosController } from './movimientos/movimientos.controller';
import { PruebasController } from './pruebas/pruebas.controller';
import { InstaladorController } from './instalador/instalador.controller';
import { FamiliasController } from './familias/familias.controller';
import { ParamsTicketController } from './params-ticket/params-ticket.controller';
import { PaytefController } from './paytef/paytef.controller';
import { VersionController } from './version/version.controller';
import { TestController } from './test/test.controller';
import { TurnosController } from './turnos/turnos.controller';
import { UtilesModule } from './utiles/utiles.module';
import { PromocionesController } from './promociones/promociones.controller';
import { DobleMenusController } from './doble-menus/doble-menus.controller';
import { TransaccionesController } from './transacciones/transacciones.controller';
import {ApagarController} from './apagar/apagar.controller';
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public')
    }),
    UtilesModule
  ],
  controllers: [
    ArticulosController, 
    MenusController,
    TecladoController, 
    CestasController, 
    ParametrosController, 
    TicketsController, 
    ApagarController,
    TrabajadoresController, CajaController, ClientesController, ImpresoraController, DevolucionesController, MovimientosController, PruebasController, InstaladorController, FamiliasController, ParamsTicketController, PaytefController, VersionController, TestController, TurnosController, PromocionesController, DobleMenusController, TransaccionesController],
  providers: [SocketGateway]  
})
export class AppModule {}
