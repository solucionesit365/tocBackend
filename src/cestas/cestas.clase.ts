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
import { TrabajadoresInterface } from "../trabajadores/trabajadores.interface";
import { trabajadoresInstance } from "../trabajadores/trabajadores.clase";

/* Siempre cargar la cesta desde MongoDB */
export class CestaClase {
  /* Eze 4.0 */
  getCestaById = async (idCesta: CestasInterface["_id"]) =>
    await schCestas.getCestaById(idCesta);

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
      idCliente: null,
    };
  }

  /* Eze 4.0 */
  getAllCestas = async () => await schCestas.getAllCestas();

  /* Eze 4.0 */
  deleteCesta = async (idCesta: CestasInterface["_id"]) =>
    await schCestas.deleteCesta(idCesta);

  /* Eze 4.0 */
  async crearCesta(idTrabajador: TrabajadoresInterface["_id"]) {
    const nuevaCesta = this.generarObjetoCesta(Date.now());
    if (await schCestas.createCesta(nuevaCesta))
      return await trabajadoresInstance.setIdCesta(
        idTrabajador,
        nuevaCesta._id
      );

    throw Error("Error, no se ha podido crear la cesta");
  }

  getTotalCesta = (cesta: CestasInterface) => cesta.detalleIva.importe1 + cesta.detalleIva.importe2 + cesta.detalleIva.importe3;

  /* Eze 4.0 */
  async borrarItemCesta(idCesta: number, index: number): Promise<boolean> {
    try {
      let cesta = await this.getCestaById(idCesta);

      cesta.lista.splice(index, 1);

      // Enviar por socket
      await this.recalcularIvas(cesta);
      return true;
    } catch (err) {
      console.log(err);
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
  async recalcularIvas(cesta: CestasInterface): Promise<CestasInterface> {
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
              cesta.idCliente
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
  async addSuplementos(
    idCesta: CestasInterface["_id"],
    arraySuplementos: ItemLista["arraySuplementos"],
    indexCesta: number
  ) {
    const cesta = await this.getCestaById(idCesta);
    cesta.lista[indexCesta].arraySuplementos = arraySuplementos;
    return await this.updateCesta(cesta);
  }

  /* Eze 4.0 */
  updateCesta = async (cesta: CestasInterface) =>
    await schCestas.updateCesta(cesta);

  /* */
  async regalarItem(idCesta: CestasInterface["_id"], index: number) {
    // El único problema será regalar un ítem que tenga más de una unidad.
    return true;
  }
}

export const cestasInstance = new CestaClase();
