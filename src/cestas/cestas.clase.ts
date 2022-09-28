import * as schCestas from "./cestas.mongodb";
import { CestasInterface, ItemLista } from "./cestas.interface";
import { construirObjetoIvas } from "../funciones/funciones";
import { articulosInstance } from "../articulos/articulos.clase";

import { cajaInstance } from "../caja/caja.clase";
import { impresoraInstance } from "../impresora/impresora.class";
import { trabajadoresInstance } from "../trabajadores/trabajadores.clase";
import { ArticulosInterface } from "../articulos/articulos.interface";
import { ClientesInterface } from "../clientes/clientes.interface";


/* Siempre cargar la cesta desde MongoDB */
export class CestaClase {
  /* Eze 4.0 */
  getCestaById = (idCesta: CestasInterface["_id"]) => schCestas.getCestaById(idCesta);

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
          valorIva3: 0
        },
        lista: []
      }
      return schCestas.updateCesta(cesta);
    }
    return false;
  }

  /* Eze 4.0 */
  generarObjetoCesta(): CestasInterface {
    return {
      _id: Date.now(),
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
    };
  }

  /* Eze 4.0 */
  getAllCestas = () => schCestas.getAllCestas();

  /* Eze 4.0 */
  deleteCesta = (idCesta: CestasInterface["_id"]) => schCestas.deleteCesta(idCesta);

  /* Eze 4.0 */
  async crearCesta() {
    const nuevaCesta = this.generarObjetoCesta();
    if (await schCestas.createCesta(nuevaCesta)) return nuevaCesta._id;
    
    return false;
  }

  /* Eze 4.0 */
  async borrarItemAndDevolverCesta(idCesta: number, idArticulo: number): Promise<CestasInterface> {
    try {
      let cesta = await this.getCestaById(idCesta);

      for (let i = 0; i < cesta.lista.length; i++) {
        if (cesta.lista[i].idArticulo == idArticulo) {
          cesta.lista.splice(i, 1);
          break;
        }
      }
      return await this.recalcularIvas(cesta);
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
      subtotal: null,
      unidades: unidades,
      precioConIva: null,
      precioPesaje: null,
      gramos: gramos,
      tipoIva: articulo.tipoIva
    });

    if (await schCestas.updateCesta(cesta)) return cesta;

    throw Error("Error updateCesta() - cesta.clase.ts");
  }

  /*  */
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
      if (idCliente) articulo = await articulosInstance.getPrecioConTarifa(articulo, idCliente);
      
      if (gramos > 0) {
        // VOY POR AQUIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII
        return await this.insertarArticulo(articulo, gramos / 1000, idCesta, arraySuplementos, gramos);
      } else {
        // modo normal
      }
    }
    throw Error("Error, la caja está cerrada. cestas.clase > clickTeclaArticulo()");
  }

  async clickTeclaArticuloVieja(
    idArticulo: CestasInterface["_id"],
    aPeso: boolean,
    gramos: any,
    idCesta: number,
    unidades: number
  ) {
    let cestaRetornar: CestasInterface = null;
    let infoArticulo;

    if (cajaInstance.cajaAbierta()) {
        if (!aPeso) {
          // TIPO NORMAL
          infoArticulo = await articulosInstance.getInfoArticulo(idArticulo);
          if (infoArticulo) {
            // AQUI PENSAR ALGUNA COMPROBACIÓN CUANDO NO EXISTA O FALLE ESTE GET
            if (infoArticulo.suplementos) {
              await this.insertarArticulo(infoArticulo, unidades, idCesta);
              return {
                suplementos: true,
                data: await articulosInstance.getSuplementos(
                  infoArticulo.suplementos
                ),
              };
            } else {
              cestaRetornar = await this.insertarArticuloCesta(
                infoArticulo,
                unidades,
                idCesta
              );
            }
          } else {
            // vueToast.abrir('error', 'Este artículo tiene errores');
          }
        } else {
          // TIPO PESO
          infoArticulo = await articulosInstance.getInfoArticulo(idArticulo);
          cestaRetornar = await this.insertarArticulo(
            infoArticulo,
            1,
            idCesta,
            infoAPeso
          );
        }

        if (cestaRetornar != undefined && cestaRetornar != null) {
          if (
            cestaRetornar.tiposIva != undefined &&
            cestaRetornar.tiposIva != null
          ) {
            trabajadoresInstance.getCurrentTrabajador().then((data) => {
              try {
                impresoraInstance.mostrarVisor({
                  dependienta: data.nombre,
                  total: (
                    cestaRetornar.tiposIva.importe1 +
                    cestaRetornar.tiposIva.importe2 +
                    cestaRetornar.tiposIva.importe3
                  ).toFixed(2),
                  precio: infoArticulo.precioConIva.toString(),
                  texto: infoArticulo.nombre,
                });
              } catch (err) {
                console.log(err);
              }
            });
          }
        }
    } else {
      console.log(
        "Error: La caja está cerrada, no se puede insertar un articulo en la cesta"
      );
      // vueToast.abrir('danger', 'Se requiere una caja abierta para cobrar');
    }
    this.udsAplicar = 1;

    return cestaRetornar;
  }
  setUnidadesAplicar(unidades: number) {
    this.udsAplicar = unidades;
  }
  async recalcularIvas(cesta: CestasInterface) {
    const cestainicial = cesta;
    cesta.tiposIva = {
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
      if (cesta.lista[i].promocion.esPromo === false) {
        if (cesta.lista[i].suplementosId) {
          for (
            let index = 0;
            index < cesta.lista[i].suplementosId.length;
            index++
          ) {
            const infoArticulo = await articulosInstance.getInfoArticulo(
              cesta.lista[i].suplementosId[index]
            );
            cesta.tiposIva = construirObjetoIvas(
              infoArticulo,
              cesta.lista[i].unidades,
              cesta.tiposIva
            );
          }
        }
        const infoArticulo = await articulosInstance.getInfoArticulo(
          cesta.lista[i]._id
        );
        const gramos =
          cestainicial.lista[i].subtotal / infoArticulo.precioConIva;
        if (
          infoArticulo.esSumable == false &&
          !cesta.lista[i].suplementosId &&
          cesta.lista[i].unidades == 1
        ) {
          const precioAplicado = infoArticulo.precioConIva * gramos;
          cesta.tiposIva = construirObjetoIvas(
            infoArticulo,
            cesta.lista[i].unidades,
            cesta.tiposIva,
            { precioAplicado: precioAplicado }
          );
        } else {
          cesta.tiposIva = construirObjetoIvas(
            infoArticulo,
            cesta.lista[i].unidades,
            cesta.tiposIva
          );
        }
        trabajadoresInstance.getCurrentTrabajador().then((data) => {
          try {
            impresoraInstance.mostrarVisor({
              dependienta: data.nombre,
              total: (
                cesta.tiposIva.importe1 +
                cesta.tiposIva.importe2 +
                cesta.tiposIva.importe3
              ).toFixed(2),
              precio: infoArticulo.precioConIva.toString(),
              texto: infoArticulo.nombre,
            });
          } catch (err) {
            console.log(err);
          }
        });
      } else if (cesta.lista[i].promocion.esPromo === true) {
        if (cesta.lista[i].nombre == "Oferta combo") {
          const infoArticuloPrincipal = await articulosInstance.getInfoArticulo(
            cesta.lista[i].promocion.infoPromo.idPrincipal
          );
          infoArticuloPrincipal.precioConIva =
            cesta.lista[i].promocion.infoPromo.precioRealPrincipal; // /(cesta.lista[i].promocion.infoPromo.unidadesOferta*cesta.lista[i].promocion.infoPromo.cantidadPrincipal);
          cesta.tiposIva = construirObjetoIvas(
            infoArticuloPrincipal,
            cesta.lista[i].promocion.infoPromo.unidadesOferta *
              cesta.lista[i].promocion.infoPromo.cantidadPrincipal,
            cesta.tiposIva
          );

          const infoArticuloSecundario =
            await articulosInstance.getInfoArticulo(
              cesta.lista[i].promocion.infoPromo.idSecundario
            );
          infoArticuloSecundario.precioConIva =
            cesta.lista[i].promocion.infoPromo.precioRealSecundario; // /(cesta.lista[i].promocion.infoPromo.unidadesOferta*cesta.lista[i].promocion.infoPromo.cantidadSecundario);
          cesta.tiposIva = construirObjetoIvas(
            infoArticuloSecundario,
            cesta.lista[i].promocion.infoPromo.unidadesOferta *
              cesta.lista[i].promocion.infoPromo.cantidadSecundario,
            cesta.tiposIva
          );
        } else {
          if (cesta.lista[i].nombre == "Oferta individual") {
            const infoArticulo = await articulosInstance.getInfoArticulo(
              cesta.lista[i].promocion.infoPromo.idPrincipal
            );
            infoArticulo.precioConIva =
              cesta.lista[i].promocion.infoPromo.precioRealPrincipal /
              (cesta.lista[i].promocion.infoPromo.unidadesOferta *
                cesta.lista[i].promocion.infoPromo.cantidadPrincipal);
            cesta.tiposIva = construirObjetoIvas(
              infoArticulo,
              cesta.lista[i].promocion.infoPromo.unidadesOferta *
                cesta.lista[i].promocion.infoPromo.cantidadPrincipal,
              cesta.tiposIva
            );
          }
        }
      }
    }
    return await cesta;
  }

  async borrarArticulosCesta(idCesta: number) {
    const cestaActual = await this.getCesta(idCesta);
    const vacia = this.nuevaCestaVacia();
    cestaActual.lista = vacia.lista;
    cestaActual.regalo = false;
    cestaActual.tiposIva = vacia.tiposIva;
    return this.setCesta(cestaActual)
      .then((res) => {
        if (res) {
          return cestaActual;
        }
        return false;
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  }

  async addSuplemento(idCesta, suplementos, idArticulo, posArticulo = -100) {
    suplementos = suplementos.map((o) => o.suplemento);
    const cestaActual = await this.getCesta(idCesta);
    cestaActual.lista = cestaActual.lista.reverse();
    let indexArticulo = posArticulo;
    if (posArticulo === -100)
      indexArticulo = cestaActual.lista.findIndex((i) => i._id === idArticulo);
    cestaActual.lista[indexArticulo].suplementosId = suplementos;
    for (const i in suplementos) {
      const idSuplemento = suplementos[i];
      const infoSuplemento = await articulosInstance.getInfoArticulo(
        idSuplemento
      );
      cestaActual.lista[indexArticulo].subtotal +=
        infoSuplemento.precioConIva * cestaActual.lista[indexArticulo].unidades;
      cestaActual.lista[indexArticulo].nombre += ` + ${infoSuplemento.nombre}`;
    }

    cestaActual.lista = cestaActual.lista.reverse();
    const cestaDef = await this.recalcularIvas(cestaActual);

    return this.setCesta(await cestaDef)
      .then((res) => {
        if (res) return cestaDef;
        return false;
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
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

  // async enviarACocina(idCesta) {
  //   const cestaActual = await this.getCesta(idCesta);
  //   let articulos = '';
  //   const suplementos = cestaActual.lista.map((i) => ({[i._id]: i.suplementosId ? i.suplementosId.map( (o) => o ) : []}));
  //   for (const i in suplementos) {
  //     const key = Object.keys(suplementos[i])[0];
  //     articulos += key;
  //     if (suplementos[i][key].length) {
  //       articulos += suplementos[i][key].map((i) => `|${i}`).join('');
  //     }
  //     articulos += ',';
  //   }
  //   articulos = articulos.slice(0, -1);
  //   return axios.get(`http://gestiondelatienda.com/printer/cocina.php?id_tienda=${parametrosInstance.getParametros().codigoTienda}&pedidos=${articulos}&empresa=${parametrosInstance.getParametros().database}&mesa=${nombreMesa}`).then((res: any) => {
  //     return true;
  //   }).catch((err) => {
  //     return false;
  //   });
  // }

  getCestaByTrabajadorID(idTrabajador: number): Promise<CestasInterface> {
    return schCestas
      .getCestaByTrabajadorID(idTrabajador)
      .then((res) => {
        if (res) return res;
        return null;
      })
      .catch((err) => {
        console.log(err);
        return null;
      });
  }

  getCestaByID(idCesta: CestasInterface["_id"]): Promise<CestasInterface> {
    return schCestas
      .getCestaByID(idCesta)
      .then((res) => {
        if (res) return res;
        return null;
      })
      .catch((err) => {
        console.log(err);
        return null;
      });
  }

  hayRegalos(cesta: CestasInterface) {
    return false;
  }

  // async calcularIvaTicket(cesta: CestasInterface) {
  //   let objetoIva: Iva = this.generarObjetoIva();

  //   for (let i = 0; i < cesta.lista.length; i++) {
  //     if (!cesta.lista[i].seRegala) {
  //       if (cesta.lista[i].esPromo) {
  //         if (cesta.lista[i].promocion.tipoPromo === "COMBO") {
  //           const articuloPrincipal = await articulosInstance.getInfoArticulo(
  //             cesta.lista[i].promocion.idPrincipal
  //           );
  //           const articuloSecundario = await articulosInstance.getInfoArticulo(
  //             cesta.lista[i].promocion.idSecundario
  //           );
  //           objetoIva = construirObjetoIvas(
  //             cesta.lista[i].promocion.precioRealPrincipal,
  //             articuloPrincipal.tipoIva,
  //             cesta.lista[i].promocion.cantidadPrincipal *
  //               cesta.lista[i].unidades,
  //             objetoIva
  //           );
  //           objetoIva = construirObjetoIvas(
  //             cesta.lista[i].promocion.precioRealSecundario,
  //             articuloSecundario.tipoIva,
  //             cesta.lista[i].promocion.cantidadSecundario *
  //               cesta.lista[i].unidades,
  //             objetoIva
  //           );
  //         } else if (cesta.lista[i].promocion.tipoPromo === "INDIVIDUAL") {
  //           const articuloIndividual = await articulosInstance.getInfoArticulo(
  //             cesta.lista[i].promocion.idPrincipal
  //           );
  //           objetoIva = construirObjetoIvas(
  //             cesta.lista[i].promocion.precioRealPrincipal,
  //             articuloIndividual.tipoIva,
  //             cesta.lista[i].unidades,
  //             objetoIva
  //           );
  //         } else {
  //           throw Error("Error: El tipo de oferta no es correcto");
  //         }
  //       } else {
  //         const infoArticulo = cesta.lista[i].infoArticulo;
  //         if (cesta.lista[i].infoArticulo.precioPesaje) {
  //           // Significa que es a peso
  //           objetoIva = construirObjetoIvas(
  //             infoArticulo.precioConIva,
  //             infoArticulo.tipoIva,
  //             cesta.lista[i].unidades,
  //             objetoIva,
  //             infoArticulo.precioPesaje
  //           );
  //         } else {
  //           objetoIva = construirObjetoIvas(
  //             infoArticulo.precioConIva,
  //             infoArticulo.tipoIva,
  //             cesta.lista[i].unidades,
  //             objetoIva
  //           );
  //         }
  //       }
  //     }
  //   }
  // }
}

export const cestasInstance = new CestaClase();

