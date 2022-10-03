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
import { impresoraInstance } from "../impresora/impresora.class";
import { trabajadoresInstance } from "../trabajadores/trabajadores.clase";
import { ArticulosInterface } from "../articulos/articulos.interface";
import { ClientesInterface } from "../clientes/clientes.interface";
import { promocionesInstance } from "src/promociones/promociones.clase";

/* Siempre cargar la cesta desde MongoDB */
export class CestaClase {
  /* Eze 4.0 */
  getCestaById = (idCesta: CestasInterface["_id"]) =>
    schCestas.getCestaById(idCesta);

  /* Eze 4.0 */
  async resetCesta(idCesta: CestasInterface["_id"]): Promise<boolean> {
    let cesta = await this.getCestaById(idCesta);
    if (cesta) {
      cesta = {
        _id: cesta._id,
        detalleIva: {
          base1: 0,
          base2: 0,
          base3: 0,
          importe1: 0,
          importe2: 0,
          importe3: 0,
          valorIva1: 0,
          valorIva2: 0,
          valorIva3: 0,
        },
        lista: [],
        modo: "VENTA",
      };
      return schCestas.updateCesta(cesta);
    }
    return false;
  }

  /* Eze 4.0 */
  generarObjetoCesta(nuevoId: CestasInterface["_id"]): CestasInterface {
    return {
      _id: nuevoId,
      detalleIva: {
        base1: 0,
        base2: 0,
        base3: 0,
        valorIva1: 0,
        valorIva2: 0,
        valorIva3: 0,
        importe1: 0,
        importe2: 0,
        importe3: 0,
      },
      lista: [],
      modo: "VENTA",
    };
  }

  /* Eze 4.0 */
  getAllCestas = () => schCestas.getAllCestas();

  /* Eze 4.0 */
  deleteCesta = (idCesta: CestasInterface["_id"]) =>
    schCestas.deleteCesta(idCesta);

  /* Eze 4.0 */
  async crearCesta() {
    const nuevaCesta = this.generarObjetoCesta(Date.now());
    if (await schCestas.createCesta(nuevaCesta)) return nuevaCesta._id;

    return false;
  }

  /* Eze 4.0 */
  async borrarItemAndDevolverCesta(
    idCesta: number,
    idArticulo: number,
    idCliente: ClientesInterface["id"]
  ): Promise<CestasInterface> {
    try {
      let cesta = await this.getCestaById(idCesta);

      for (let i = 0; i < cesta.lista.length; i++) {
        if (cesta.lista[i].idArticulo == idArticulo) {
          cesta.lista.splice(i, 1);
          break;
        }
      }
      return await this.recalcularIvas(cesta, idCliente);
    } catch (err) {
      console.log(err);
      return null;
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
    const cesta = await this.getCestaById(idCesta);

    cesta.lista.push({
      idArticulo: articulo._id,
      nombre: articulo.nombre,
      arraySuplementos: arraySuplementos,
      promocion: null,
      regalo: false,
      subtotal: unidades * articulo.precioConIva,
      unidades: unidades,
      precioConIva: articulo.precioConIva,
      gramos: gramos,
      tipoIva: articulo.tipoIva,
    });

    if (await schCestas.updateCesta(cesta)) return cesta;

    throw Error("Error updateCesta() - cesta.clase.ts");
  }

  /* Eze 4.0 */
  async clickTeclaArticulo(
    idArticulo: CestasInterface["_id"],
    gramos: ItemLista["gramos"],
    idCesta: number,
    unidades: number,
    idCliente: ClientesInterface["id"],
    arraySuplementos: ItemLista["arraySuplementos"]
  ) {
    if (await cajaInstance.cajaAbierta()) {
      let articulo = await articulosInstance.getInfoArticulo(idArticulo);
      if (idCliente)
        articulo = await articulosInstance.getPrecioConTarifa(
          articulo,
          idCliente
        );

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
      valorIva1: 0,
      valorIva2: 0,
      valorIva3: 0,
      importe1: 0,
      importe2: 0,
      importe3: 0,
    };
    if (itemPromocion.promocion.tipoPromo === "INDIVIDUAL") {
      const articulo = await articulosInstance.getInfoArticulo(
        itemPromocion.promocion.idArticuloPrincipal
      );
      const importeRealUnitario =
        itemPromocion.promocion.precioRealArticuloPrincipal;
      const unidadesTotales =
        itemPromocion.promocion.unidadesOferta * itemPromocion.unidades;
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
  async recalcularIvas(
    cesta: CestasInterface,
    idCliente: ClientesInterface["id"]
  ): Promise<CestasInterface> {
    cesta.detalleIva = {
      base1: 0,
      base2: 0,
      base3: 0,
      valorIva1: 0,
      valorIva2: 0,
      valorIva3: 0,
      importe1: 0,
      importe2: 0,
      importe3: 0,
    };

    for (let i = 0; i < cesta.lista.length; i++) {
      if (cesta.lista[i].promocion) {
        if (cesta.lista[i].arraySuplementos.length > 0) {
          cesta.detalleIva = fusionarObjetosDetalleIva(
            cesta.detalleIva,
            await this.getDetalleIvaSuplementos(
              cesta.lista[i].arraySuplementos,
              idCliente
            )
          );
        }

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
            idCliente
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
        }
      }
    }
    return cesta;
  }

  /* Eze 4.0 */
  async getDetalleIvaSuplementos(
    arraySuplementos: ItemLista["arraySuplementos"],
    idCliente: ClientesInterface["id"]
  ): Promise<DetalleIvaInterface> {
    let objetoIva: DetalleIvaInterface = {
      base1: 0,
      base2: 0,
      base3: 0,
      valorIva1: 0,
      valorIva2: 0,
      valorIva3: 0,
      importe1: 0,
      importe2: 0,
      importe3: 0,
    };

    for (let i = 0; i < arraySuplementos.length; i++) {
      let articulo = await articulosInstance.getInfoArticulo(
        arraySuplementos[i]
      );
      articulo = await articulosInstance.getPrecioConTarifa(
        articulo,
        idCliente
      );
      objetoIva = construirObjetoIvas(
        articulo.precioConIva,
        articulo.tipoIva,
        1
      );
    }
    return objetoIva;
  }

  /* Eze 4.0 */
  async borrarArticulosCesta(idCesta: number) {
    const vacia = this.generarObjetoCesta(idCesta);
    return await this.updateCesta(vacia);
  }

  /* Eze 4.0 */
  async addSuplemento(
    idCesta: CestasInterface["_id"],
    idArticuloSuplemento: ArticulosInterface["_id"],
    indexCesta: number
  ) {
    const cesta = await this.getCestaById(idCesta);
    cesta.lista[indexCesta].arraySuplementos.push(idArticuloSuplemento);
    return await this.updateCesta(cesta);
  }

  async modificarSuplementos(cestaId, idArticulo, posArticulo) {
    const cestaActual = await this.getCesta(cestaId);
    // const indexArticulo = cestaActual.lista.findIndex(i => i._id === idArticulo);
    cestaActual.lista = cestaActual.lista.reverse();
    const indexArticulo = posArticulo;
    const suplementos = cestaActual.lista[indexArticulo].suplementosId;
    const infoArticulo = await articulosInstance.getInfoArticulo(idArticulo);
    const suplementosArticulo = await articulosInstance.getSuplementos(
      infoArticulo.suplementos
    );
    cestaActual.lista[indexArticulo].nombre =
      cestaActual.lista[indexArticulo].nombre.split("+")[0];
    cestaActual.lista[indexArticulo].suplementosId = [];
    for (let i = 0; i < suplementos.length; i++) {
      const dataArticulo = await articulosInstance.getInfoArticulo(
        suplementos[i]
      );
      cestaActual.lista[indexArticulo].subtotal -= dataArticulo.precioConIva;
    }
    cestaActual.lista = cestaActual.lista.reverse();
    this.setCesta(cestaActual);
    const res = {
      suplementos: suplementosArticulo.length > 0 ? true : false,
      suplementosData: suplementosArticulo,
      suplementosSeleccionados: suplementos,
    };
    return res;
  }

  /* Eze 4.0 */
  updateCesta = async (cesta: CestasInterface) =>
    await schCestas.updateCesta(cesta);
}

export const cestasInstance = new CestaClase();
