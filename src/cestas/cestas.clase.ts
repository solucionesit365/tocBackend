import * as schCestas from "./cestas.mongodb";
import {
  CestasInterface,
  DetalleIvaInterface,
  ItemLista,
} from "./cestas.interface";
import {
  construirObjetoIvas,
  fusionarObjetosDetalleIva,
} from "../funciones/funciones";
import { articulosInstance } from "../articulos/articulos.clase";
import { cajaInstance } from "../caja/caja.clase";
import { ArticulosInterface } from "../articulos/articulos.interface";
import { ClientesInterface } from "../clientes/clientes.interface";
import { ObjectId } from "mongodb";
import { logger } from "../logger";
import { io } from "../sockets.gateway";
import { nuevaInstancePromociones } from "../promociones/promociones.clase";
import { clienteInstance } from "../clientes/clientes.clase";
import axios from "axios";

export class CestaClase {
  /* Eze 4.0 */
  async actualizarCestas() {
    const arrayCestas = await cestasInstance.getAllCestas();
    io.emit("cargarCestas", arrayCestas);
    // cestasInstance
    //   .getAllCestas()
    //   .then((arrayCestas) => {

    //   })
    //   .catch((err) => {
    //     logger.Error(119, err);
    //   });
  }

  /* Eze 4.0 */
  getCestaById = async (idCesta: CestasInterface["_id"]) =>
    await schCestas.getCestaById(idCesta);

  /* Eze 4.0 */
  private generarObjetoCesta(nuevoId: CestasInterface["_id"]): CestasInterface {
    return {
      _id: nuevoId,
      timestamp: Date.now(),
      detalleIva: {
        base1: 0,
        base2: 0,
        base3: 0,
        base4: 0,
        base5: 0,
        valorIva1: 0,
        valorIva2: 0,
        valorIva3: 0,
        valorIva4: 0,
        valorIva5: 0,
        importe1: 0,
        importe2: 0,
        importe3: 0,
        importe4: 0,
        importe5: 0,
      },
      lista: [],
      modo: "VENTA",
      idCliente: null,
      indexMesa: null,
    };
  }

  /* Eze 4.0 */
  getAllCestas = async () => await schCestas.getAllCestas();

  /* Eze 4.0 */
  deleteCesta = async (idCesta: CestasInterface["_id"]) =>
    await schCestas.deleteCesta(idCesta);

  /* Eze 4.0 */
  async crearCesta(indexMesa = null): Promise<CestasInterface["_id"]> {
    const nuevaCesta = this.generarObjetoCesta(new ObjectId());
    nuevaCesta.indexMesa = indexMesa;
    if (await schCestas.createCesta(nuevaCesta)) return nuevaCesta._id;
    throw Error("Error, no se ha podido crear la cesta");
  }

  /* Eze 4.0 */
  getTotalCesta = (cesta: CestasInterface) =>
    cesta.detalleIva.importe1 +
    cesta.detalleIva.importe2 +
    cesta.detalleIva.importe3 +
    cesta.detalleIva.importe4 +
    cesta.detalleIva.importe5;

  /* Eze 4.0 */
  async borrarItemCesta(
    idCesta: CestasInterface["_id"],
    index: number
  ): Promise<boolean> {
    try {
      let cesta = await this.getCestaById(idCesta);

      cesta.lista.splice(index, 1);

      // Enviar por socket
      await this.recalcularIvas(cesta);
      if (await this.updateCesta(cesta)) {
        this.actualizarCestas();
        return true;
      }
      throw Error(
        "Error, no se ha podido actualizar la cesta borrarItemCesta()"
      );
    } catch (err) {
      logger.Error(57, err);
      return false;
    }
  }

  /* Eze: este nombre no vale, hace otra cosa */
  async limpiarCesta(
    unaCesta: CestasInterface,
    posicionPrincipal: number,
    posicionSecundario: number,
    sobraCantidadPrincipal: number,
    sobraCantidadSecundario: number,
    pideDelA: number,
    pideDelB: number
  ) {
    if (pideDelA != -1) {
      if (sobraCantidadPrincipal > 0) {
        const datosArticulo = await articulosInstance.getInfoArticulo(
          unaCesta.lista[posicionPrincipal].idArticulo
        );
        unaCesta.lista[posicionPrincipal].unidades = sobraCantidadPrincipal;
        unaCesta.lista[posicionPrincipal].subtotal =
          sobraCantidadPrincipal * datosArticulo.precioConIva;
      } else {
        unaCesta.lista.splice(posicionPrincipal, 1);
      }
    }

    if (pideDelB != -1) {
      if (sobraCantidadSecundario > 0) {
        const datosArticulo = await articulosInstance.getInfoArticulo(
          unaCesta.lista[posicionSecundario].idArticulo
        );
        unaCesta.lista[posicionSecundario].unidades = sobraCantidadSecundario;
        unaCesta.lista[posicionSecundario].subtotal =
          sobraCantidadSecundario * datosArticulo.precioConIva;
      } else {
        if (posicionSecundario > posicionPrincipal) {
          unaCesta.lista.splice(posicionSecundario - 1, 1);
        } else {
          unaCesta.lista.splice(posicionSecundario, 1);
        }
      }
    }
    return unaCesta;
  }

  /* Eze 4.0 => la información del artículo "articulo" debe estar masticada (tarifas especiales) */
  async insertarArticulo(
    articulo: ArticulosInterface,
    unidades: number,
    idCesta: CestasInterface["_id"],
    arraySuplementos: ItemLista["arraySuplementos"], // Los suplentos no deben tener tarifa especial para simplificar.
    gramos: ItemLista["gramos"]
  ): Promise<CestasInterface> {
    let cesta = await this.getCestaById(idCesta);
    let articuloNuevo = true;

    if (
      !(await nuevaInstancePromociones.gestionarPromociones(
        cesta,
        articulo._id,
        unidades
      ))
    ) {
      for (let i = 0; i < cesta.lista.length; i++) {
        if (
          cesta.lista[i].idArticulo === articulo._id &&
          !cesta.lista[i].promocion &&
          !cesta.lista[i].regalo
        ) {
          cesta.lista[i].unidades += unidades;
          cesta.lista[i].subtotal += unidades * articulo.precioConIva;
          articuloNuevo = false;
          break;
        }
      }

      if (articuloNuevo) {
        cesta.lista.push({
          idArticulo: articulo._id,
          nombre: articulo.nombre,
          arraySuplementos: arraySuplementos,
          promocion: null,
          regalo: false,
          subtotal: unidades * articulo.precioConIva,
          unidades: unidades,
          gramos: gramos,
        });
      }
    }

    await this.recalcularIvas(cesta);

    if (await schCestas.updateCesta(cesta)) return cesta;

    throw Error("Error updateCesta() - cesta.clase.ts");
  }

  /* Eze 4.0 */
  async clickTeclaArticulo(
    idArticulo: ArticulosInterface["_id"],
    gramos: ItemLista["gramos"],
    idCesta: CestasInterface["_id"],
    unidades: number,
    arraySuplementos: ItemLista["arraySuplementos"]
  ) {
    if (await cajaInstance.cajaAbierta()) {
      let articulo = await articulosInstance.getInfoArticulo(idArticulo);
      const cesta = await cestasInstance.getCestaById(idCesta);

      if (cesta.idCliente) {
        articulo = await articulosInstance.getPrecioConTarifa(
          articulo,
          cesta.idCliente
        );
      }

      // Va a peso. 1 unidad son 1000 gramos. Los precios son por kilogramo.
      if (gramos > 0)
        return await this.insertarArticulo(
          articulo,
          gramos / 1000,
          idCesta,
          arraySuplementos,
          gramos
        );

      // Modo por unidad
      return await this.insertarArticulo(
        articulo,
        unidades,
        idCesta,
        arraySuplementos,
        null
      );
    }
    throw Error(
      "Error, la caja está cerrada. cestas.clase > clickTeclaArticulo()"
    );
  }

  /* Eze 4.0 */
  async getDetalleIvaPromocion(
    itemPromocion: ItemLista
  ): Promise<DetalleIvaInterface> {
    let detalleIva: DetalleIvaInterface = {
      base1: 0,
      base2: 0,
      base3: 0,
      base4: 0,
      base5: 0,
      valorIva1: 0,
      valorIva2: 0,
      valorIva3: 0,
      valorIva4: 0,
      valorIva5: 0,
      importe1: 0,
      importe2: 0,
      importe3: 0,
      importe4: 0,
      importe5: 0,
    };

    if (itemPromocion.promocion.tipoPromo === "INDIVIDUAL") {
      const articulo = await articulosInstance.getInfoArticulo(
        itemPromocion.promocion.idArticuloPrincipal
      );

      const importeRealUnitario =
        itemPromocion.promocion.precioRealArticuloPrincipal;
      const unidadesTotales = itemPromocion.promocion.cantidadArticuloPrincipal
        ? itemPromocion.promocion.cantidadArticuloPrincipal
        : itemPromocion.promocion.cantidadArticuloSecundario *
          itemPromocion.unidades;
      detalleIva = construirObjetoIvas(
        importeRealUnitario,
        articulo.tipoIva,
        unidadesTotales
      );
    } else if (itemPromocion.promocion.tipoPromo === "COMBO") {
      const articuloPrincipal = await articulosInstance.getInfoArticulo(
        itemPromocion.promocion.idArticuloPrincipal
      );
      const articuloSecundario = await articulosInstance.getInfoArticulo(
        itemPromocion.promocion.idArticuloSecundario
      );

      const importeRealUnitarioPrincipal =
        itemPromocion.promocion.precioRealArticuloPrincipal;
      const importeRealUnitarioSecundario =
        itemPromocion.promocion.precioRealArticuloSecundario;
      const unidadesTotalesPrincipal =
        itemPromocion.promocion.cantidadArticuloPrincipal *
        itemPromocion.unidades;
      const unidadesTotalesSecundario =
        itemPromocion.promocion.cantidadArticuloSecundario *
        itemPromocion.unidades;
      const detalleIva1 = construirObjetoIvas(
        importeRealUnitarioPrincipal,
        articuloPrincipal.tipoIva,
        unidadesTotalesPrincipal
      );
      const detalleIva2 = construirObjetoIvas(
        importeRealUnitarioSecundario,
        articuloSecundario.tipoIva,
        unidadesTotalesSecundario
      );
      detalleIva = fusionarObjetosDetalleIva(detalleIva1, detalleIva2);
    } else {
      throw Error(
        "Error cestas.clase > getDetalleIvaPromocion. El tipo de oferta no corresponde con ningún tipo conocido"
      );
    }
    return detalleIva;
  }

  /* Eze 4.0 */
  async recalcularIvas(cesta: CestasInterface) {
    cesta.detalleIva = {
      base1: 0,
      base2: 0,
      base3: 0,
      base4: 0,
      base5: 0,
      valorIva1: 0,
      valorIva2: 0,
      valorIva3: 0,
      valorIva4: 0,
      valorIva5: 0,
      importe1: 0,
      importe2: 0,
      importe3: 0,
      importe4: 0,
      importe5: 0,
    };

    for (let i = 0; i < cesta.lista.length; i++) {
      if (cesta.lista[i].regalo) continue;

      if (cesta.lista[i].promocion) {
        // Una promoción no puede llevar suplementos
        cesta.detalleIva = fusionarObjetosDetalleIva(
          cesta.detalleIva,
          await this.getDetalleIvaPromocion(cesta.lista[i])
        );
      } else {
        let articulo = await articulosInstance.getInfoArticulo(
          cesta.lista[i].idArticulo
        );
        articulo = await articulosInstance.getPrecioConTarifa(
          articulo,
          cesta.idCliente
        );

        const auxDetalleIva = construirObjetoIvas(
          articulo.precioConIva,
          articulo.tipoIva,
          cesta.lista[i].unidades
        );
        cesta.detalleIva = fusionarObjetosDetalleIva(
          auxDetalleIva,
          cesta.detalleIva
        );
        cesta.lista[i].subtotal =
          articulo.precioConIva * cesta.lista[i].unidades;
        /* Detalle IVA de suplementos */
        if (
          cesta.lista[i].arraySuplementos &&
          cesta.lista[i].arraySuplementos.length > 0
        ) {
          const detalleDeSuplementos = await this.getDetalleIvaSuplementos(
            cesta.lista[i].arraySuplementos,
            cesta.idCliente
          );
          cesta.detalleIva = fusionarObjetosDetalleIva(
            cesta.detalleIva,
            detalleDeSuplementos
          );
          cesta.lista[i].subtotal +=
            detalleDeSuplementos.importe1 +
            detalleDeSuplementos.importe2 +
            detalleDeSuplementos.importe3 +
            detalleDeSuplementos.importe4 +
            detalleDeSuplementos.importe5;
        }
      }
    }
  }

  /* Eze 4.0 */
  async getDetalleIvaSuplementos(
    arraySuplementos: ArticulosInterface[],
    idCliente: ClientesInterface["id"]
  ): Promise<DetalleIvaInterface> {
    let objetoIva: DetalleIvaInterface = {
      base1: 0,
      base2: 0,
      base3: 0,
      base4: 0,
      base5: 0,
      valorIva1: 0,
      valorIva2: 0,
      valorIva3: 0,
      valorIva4: 0,
      valorIva5: 0,
      importe1: 0,
      importe2: 0,
      importe3: 0,
      importe4: 0,
      importe5: 0,
    };

    for (let i = 0; i < arraySuplementos.length; i++) {
      let articulo = await articulosInstance.getInfoArticulo(
        arraySuplementos[i]._id
      );
      articulo = await articulosInstance.getPrecioConTarifa(
        articulo,
        idCliente
      );
      objetoIva = fusionarObjetosDetalleIva(
        construirObjetoIvas(articulo.precioConIva, articulo.tipoIva, 1),
        objetoIva
      );
    }
    return objetoIva;
  }

  /* Eze 4.0 */
  async borrarArticulosCesta(
    idCesta: CestasInterface["_id"],
    borrarCliente = false,
    borrarModo = false
  ) {
    const cesta = await this.getCestaById(idCesta);

    if (cesta) {
      cesta.lista = [];
      cesta.detalleIva = {
        base1: 0,
        base2: 0,
        base3: 0,
        base4: 0,
        base5: 0,
        importe1: 0,
        importe2: 0,
        importe3: 0,
        importe4: 0,
        importe5: 0,
        valorIva1: 0,
        valorIva2: 0,
        valorIva3: 0,
        valorIva4: 0,
        valorIva5: 0,
      };
      if (borrarCliente) cesta.idCliente = "";
      if (borrarModo) cesta.modo = "VENTA";

      if (await this.updateCesta(cesta)) {
        this.actualizarCestas();
        return true;
      }
    }
    throw Error("Error en updateCesta borrarArticulosCesta()");
  }

  // /* Eze 4.0 */
  // async addItemConSuplementos(
  //   idCesta: CestasInterface["_id"],
  //   arraySuplementos: ArticulosInterface[],
  //   idArticuloGeneral: ArticulosInterface["_id"],
  //   unidades: number
  // ) {
  //   const cesta = await this.getCestaById(idCesta);

  //   const objPushSuplementos: ItemLista["arraySuplementos"] = [];
  //   for (let i = 0; i < arraySuplementos.length; i++) {
  //     objPushSuplementos.push({
  //       id: arraySuplementos[i]._id,
  //       nombre: arraySuplementos[i].nombre,
  //       precioConIva: arraySuplementos[i].precioConIva,
  //     });
  //   }

  //   const articuloGeneral: ArticulosInterface =
  //     await articulosInstance.getInfoArticulo(idArticuloGeneral);
  //   if (cesta.idCliente) {
  //     const articuloConTarifa = await articulosInstance.getPrecioConTarifa(
  //       articuloGeneral,
  //       cesta.idCliente
  //     );
  //     articuloGeneral.precioBase = articuloConTarifa.precioBase;
  //     articuloGeneral.precioConIva = articuloConTarifa.precioConIva;
  //   }

  //   if (
  //     await this.clickTeclaArticulo(
  //       idArticuloGeneral,
  //       0,
  //       idCesta,
  //       unidades,
  //       objPushSuplementos
  //     )
  //   ) {
  //     this.actualizarCestas();
  //     return true;
  //   }
  //   throw Error("No se ha podido insertar el artículo con suplemento");
  // }

  /* Eze 4.0 */
  updateCesta = async (cesta: CestasInterface) =>
    await schCestas.updateCesta(cesta);

  /* Eze 4.0 */
  async regalarItem(idCesta: CestasInterface["_id"], index: number) {
    const cesta = await cestasInstance.getCestaById(idCesta);
    if (cesta && cesta.idCliente) {
      const cliente = await clienteInstance.getClienteById(cesta.idCliente);
      if (cliente.albaran) return false;
    } else {
      return false;
    }

    cesta.lista[index].regalo = true;
    cesta.lista[index].subtotal = 0;
    await cestasInstance.recalcularIvas(cesta);

    if (await cestasInstance.updateCesta(cesta)) {
      await this.actualizarCestas();
      return true;
    }
    throw Error("No se ha podido actualizar la cesta");
  }
}

export const cestasInstance = new CestaClase();
