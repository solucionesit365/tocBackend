import { Controller, Post, Body } from "@nestjs/common";
import { articulosInstance } from "./articulos.clase";

@Controller("articulos")
export class ArticulosController {
  /* Eze 4.0 */
  @Post("getArticulo")
  async getArticulo(@Body() { idArticulo, idCliente }) {

    try {
      if (idArticulo) return await articulosInstance.getPrecioConTarifa(await articulosInstance.getInfoArticulo(idArticulo), idCliente);
      throw Error("Error, faltan datos en getArticulo controller");
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  // @Post("editarArticulo")
  // editarArticulo(@Body() params) {
  //   if (
  //     params.idArticulo &&
  //     params.nombre &&
  //     params.precioBase &&
  //     params.precioConIva
  //   ) {
  //     // console.log('Hola', params.idArticulo, params.nombre, params.precioBase, params.precioConIva)
  //     return articulosInstance
  //       .editarArticulo(
  //         params.idArticulo,
  //         params.nombre,
  //         params.precioBase,
  //         params.precioConIva
  //       )
  //       .then((res) => {
  //         if (res) {
  //           return { error: false, info: res };
  //         }
  //         return { error: true, mensaje: "Backend: Error, faltan datos" };
  //       });
  //   } else {
  //     return {
  //       error: true,
  //       mensaje: "Backend: Faltan datos en articulos/editarArticulo",
  //     };
  //   }
  // }
}
