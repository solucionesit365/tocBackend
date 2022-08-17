import { Body, Controller, Post, Get } from "@nestjs/common";
import { trabajadoresInstance } from "./trabajadores.clase";
import { UtilesModule } from "../utiles/utiles.module";

@Controller("trabajadores")
export class TrabajadoresController {

  /* Eze v23 */
  @Get("getTrabajadoresFichados")
  getTrabajadoresFichados() {
    return trabajadoresInstance.getTrabajadoresFichados();
  }

  /* Eze v23 */
  @Post("buscar")
  buscar(@Body() params) {
    return trabajadoresInstance.buscar(params.busqueda);
  }

  /* Eze v23 */
  @Post("fichar")
  fichar(@Body() params) {
    if (UtilesModule.checkVariable(params.idTrabajador))
      return trabajadoresInstance.ficharTrabajador(params.idTrabajador);

    return false;
  }

  /* Eze v23 */
  @Post("desfichar")
  desfichar(@Body() params) {
    if (UtilesModule.checkVariable(params.idTrabajador))
      return trabajadoresInstance.desficharTrabajador(params.idTrabajador);

    return false;
  }

  /* Eze v23 */
  @Post("actualizarTrabajadores")
  actualizarTrabajadores() {
    return trabajadoresInstance.actualizarTrabajadores();
  }

  /* Eze v23 */
  @Post("inicioDescanso")
  inicioDescanso(@Body() params) {
    if (UtilesModule.checkVariable(params.idTrabajador)) {
      return trabajadoresInstance.inicioDescanso(params.idTrabajador);
    }
    return false;
  }

  /* Eze v23 */
  @Post("finDescanso")
  finDescanso(@Body() params) {
    if (UtilesModule.checkVariable(params.idTrabajador)) {
      return trabajadoresInstance.finDescanso(params.idTrabajador);
    }
    return false;
  }
}
