import axios from "axios";
import { articulosInstance } from "../articulos/articulos.clase";
import { ArticulosInterface } from "../articulos/articulos.interface";
import { CestasInterface } from "../cestas/cestas.interface";
import { logger } from "../logger";
import { PromocionesInterface, InfoPromocionIndividual, InfoPromocionCombo, PreciosReales } from "./promociones.interface";
import * as schPromociones from "./promociones.mongodb";

export class NuevaPromocion {
    private promosIndividuales: PromocionesInterface[] = [];
    private promosCombo: PromocionesInterface[] = [];

    constructor() {
        schPromociones.getPromosCombo().then((combos) => {
            this.promosCombo = combos;
        }).catch((err) => {
            logger.Error(128, err);
            this.promosCombo = [];
        });

        schPromociones.getPromosIndividuales().then((individuales) => {
            this.promosIndividuales = individuales;
        }).catch((err) => {
            logger.Error(129, err);
            this.promosIndividuales = [];
        });
    }

    async descargarPromociones() {
        const resPromos = (await axios.get("promociones/getPromocionesNueva")).data as PromocionesInterface[];
        if (resPromos && resPromos.length > 0) {
            return await schPromociones.insertarPromociones(resPromos);
        }
        throw Error("No hay promociones para descargar");
    }

    public async gestionarPromociones(cesta: CestasInterface, idArticulo: ArticulosInterface["_id"], unidades: number): Promise<boolean> {
        let unidadesTotales = unidades;
        let index1 = null;
        
        for (let i = 0; i < cesta.lista.length; i++) {
            if (cesta.lista[i].idArticulo === idArticulo) {
                unidadesTotales += cesta.lista[i].unidades;
                index1 = i;
                break;
            }
        }

        /* INDIVIDUALES */
        const promoIndividual = await this.buscarPromocionesIndividuales(idArticulo, unidadesTotales);
        if (promoIndividual) {
            if (index1 != null) cesta.lista.splice(index1, 1);
            this.aplicarPromoIndividual(cesta, promoIndividual);
            if (promoIndividual.sobran > 0) this.aplicarSobraIndividual(cesta, idArticulo, promoIndividual);
            return true;
        }
        
        /* COMBO */
        let promoComboSecundario: { indexPromo: number; cantidadPromos: number; sobran: number; } = null;
        const promoComboPrincipal = this.buscarPromocionesComboPrincipal(idArticulo, unidadesTotales);
        if (promoComboPrincipal) {
            
            // BUSCAR AHORA LOS SECUNDARIOS EN LA LISTA IGNORANDO EL IDARTICULO INSERTADO EN ESTE MOMENTO
            for (let i = 0; i < cesta.lista.length; i++) {
                
                if (idArticulo != cesta.lista[i].idArticulo) {
                    
                    for (let j = 0; j < this.promosCombo[promoComboPrincipal.indexPromo].secundario.length; j++) {
                        if (this.promosCombo[promoComboPrincipal.indexPromo].secundario[j] === cesta.lista[i].idArticulo) {
                            
                            if (cesta.lista[i].unidades >= this.promosCombo[promoComboPrincipal.indexPromo].cantidadSecundario) {
                                
                                const cantidadPromos = Math.trunc(cesta.lista[i].unidades/this.promosCombo[promoComboPrincipal.indexPromo].cantidadSecundario);
                                const sobran = cesta.lista[i].unidades%this.promosCombo[promoComboPrincipal.indexPromo].cantidadSecundario;
                                let aux = this.cuantasSePuedenAplicar(promoComboPrincipal, {
                                    cantidadPromos,
                                    sobran,
                                    indexPromo: promoComboPrincipal.indexPromo
                                });
                                const articuloPrincipal = await articulosInstance.getInfoArticulo(idArticulo);
                                const articuloSecundario = await articulosInstance.getInfoArticulo(cesta.lista[i].idArticulo);

                                const infoFinal: InfoPromocionCombo = {...aux, ...{
                                    indexListaOriginalPrincipal: index1,
                                    indexListaOriginalSecundario: i,
                                    idArticuloPrincipal: idArticulo,
                                    idArticuloSecundario: cesta.lista[i].idArticulo,
                                    precioPromoUnitario: this.promosCombo[promoComboPrincipal.indexPromo].precioFinal,
                                    idPromocion: this.promosCombo[promoComboPrincipal.indexPromo]._id,
                                    cantidadNecesariaPrincipal: this.promosCombo[promoComboPrincipal.indexPromo].cantidadPrincipal,
                                    cantidadNecesariaSecundario: this.promosCombo[promoComboPrincipal.indexPromo].cantidadSecundario,
                                    nombrePrincipal: articuloPrincipal.nombre,
                                    nombreSecundario: articuloSecundario.nombre
                                }};
                                this.deleteIndexCestaCombo(cesta, infoFinal.indexListaOriginalPrincipal, infoFinal.indexListaOriginalSecundario);

                                const preciosReales = this.calcularPrecioRealCombo(infoFinal, articuloPrincipal, articuloSecundario);
                                this.aplicarPromoCombo(cesta, infoFinal, articuloPrincipal, articuloSecundario, preciosReales);
                                if (infoFinal.sobranPrincipal > 0) this.aplicarSobraComboPrincipal(cesta, infoFinal);
                                if (infoFinal.sobranSecundario > 0) this.aplicarSobraComboSecundario(cesta, infoFinal);
                                
                                return true;
                            }
                        }
                    }
                }
            }
        } else if (promoComboSecundario = this.buscarPromocionesComboSecundario(idArticulo, unidadesTotales)) {
            
            // BUSCAR AHORA LOS SECUNDARIOS EN LA LISTA IGNORANDO EL IDARTICULO INSERTADO EN ESTE MOMENTO
            for (let i = 0; i < cesta.lista.length; i++) {
            
                if (idArticulo != cesta.lista[i].idArticulo) {
                    
                    for (let j = 0; j < this.promosCombo[promoComboSecundario.indexPromo].principal.length; j++) {
                        
                        if (this.promosCombo[promoComboSecundario.indexPromo].principal[j] === cesta.lista[i].idArticulo) {
                            
                            if (cesta.lista[i].unidades >= this.promosCombo[promoComboSecundario.indexPromo].cantidadPrincipal) {
                                
                                const cantidadPromos = Math.trunc(cesta.lista[i].unidades/this.promosCombo[promoComboSecundario.indexPromo].cantidadPrincipal);
                                const sobran = cesta.lista[i].unidades%this.promosCombo[promoComboSecundario.indexPromo].cantidadPrincipal;
                                let aux = this.cuantasSePuedenAplicar(promoComboSecundario, {
                                    cantidadPromos,
                                    sobran,
                                    indexPromo: promoComboSecundario.indexPromo
                                });
                                const articuloPrincipal = await articulosInstance.getInfoArticulo(cesta.lista[i].idArticulo);
                                const articuloSecundario = await articulosInstance.getInfoArticulo(idArticulo);

                                const infoFinal: InfoPromocionCombo = {...aux, ...{
                                    indexListaOriginalPrincipal: index1,
                                    indexListaOriginalSecundario: i,
                                    idArticuloPrincipal: idArticulo,
                                    idArticuloSecundario: cesta.lista[i].idArticulo,
                                    precioPromoUnitario: this.promosCombo[promoComboSecundario.indexPromo].precioFinal,
                                    idPromocion: this.promosCombo[promoComboSecundario.indexPromo]._id,
                                    cantidadNecesariaPrincipal: this.promosCombo[promoComboSecundario.indexPromo].cantidadSecundario,
                                    cantidadNecesariaSecundario: this.promosCombo[promoComboSecundario.indexPromo].cantidadPrincipal,
                                    nombrePrincipal: articuloPrincipal.nombre,
                                    nombreSecundario: articuloSecundario.nombre
                                }};
                                this.deleteIndexCestaCombo(cesta, infoFinal.indexListaOriginalPrincipal, infoFinal.indexListaOriginalSecundario);

                                const preciosReales = this.calcularPrecioRealCombo(infoFinal, articuloPrincipal, articuloSecundario);
                                this.aplicarPromoCombo(cesta, infoFinal, articuloPrincipal, articuloSecundario, preciosReales);
                                if (infoFinal.sobranPrincipal > 0) this.aplicarSobraComboPrincipal(cesta, infoFinal);
                                if (infoFinal.sobranSecundario > 0) this.aplicarSobraComboSecundario(cesta, infoFinal);
                                
                                return true;
                            }
                        }
                    }
                }
            }
        }
        return false;
    }

    private cuantasSePuedenAplicar(infoPromoPrincipal: { indexPromo: number; cantidadPromos: number; sobran: number; }, infoPromoSecundario: { indexPromo: number; cantidadPromos: number; sobran: number; }) {
        const unidadesPromo = Math.min(infoPromoPrincipal.cantidadPromos, infoPromoSecundario.cantidadPromos);
        const sobranPrincipal = (infoPromoPrincipal.cantidadPromos-unidadesPromo)*this.promosCombo[infoPromoPrincipal.indexPromo].cantidadPrincipal+infoPromoPrincipal.sobran;
        const sobranSecundario = (infoPromoSecundario.cantidadPromos-unidadesPromo)*this.promosCombo[infoPromoSecundario.indexPromo].cantidadSecundario+infoPromoSecundario.sobran;
        return { seAplican: unidadesPromo, sobranPrincipal, sobranSecundario };        
    }

    private async buscarPromocionesIndividuales(idArticulo: ArticulosInterface["_id"], unidadesTotales: number): Promise<InfoPromocionIndividual> {
        for (let i = 0; i < this.promosIndividuales.length; i++) {
            if (this.promosIndividuales[i].principal && this.promosIndividuales[i].principal.length > 0) {
                for (let j = 0; j < this.promosIndividuales[i].principal.length; j++) {
                    if (this.promosIndividuales[i].principal[j] === idArticulo && unidadesTotales >= this.promosIndividuales[i].cantidadPrincipal) {
                        // Hay oferta
                        const cantidadPromos = Math.trunc(unidadesTotales/this.promosIndividuales[i].cantidadPrincipal);
                        const sobran = unidadesTotales%this.promosIndividuales[i].cantidadPrincipal;
                        const nombreArticulo = (await articulosInstance.getInfoArticulo(idArticulo)).nombre;
                        return { 
                            cantidadPromos,
                            sobran,
                            precioConIva: this.promosIndividuales[i].precioFinal*cantidadPromos*this.promosIndividuales[i].cantidadPrincipal,
                            idPromocion: this.promosIndividuales[i]._id,
                            nombreArticulo,
                            idArticulo,
                            cantidadNecesaria: this.promosIndividuales[i].cantidadPrincipal,
                            precioUnidad: this.promosIndividuales[i].precioFinal
                        };
                    }
                }
            } else if (this.promosIndividuales[i].secundario && this.promosIndividuales[i].secundario.length > 0) {
                for (let j = 0; j < this.promosIndividuales[i].secundario.length; j++) {
                    if (this.promosIndividuales[i].secundario[j] === idArticulo && unidadesTotales >= this.promosIndividuales[i].cantidadSecundario) {
                        // Hay oferta
                        const cantidadPromos = Math.trunc(unidadesTotales/this.promosIndividuales[i].cantidadSecundario);
                        const sobran = unidadesTotales%this.promosIndividuales[i].cantidadSecundario;
                        const nombreArticulo = (await articulosInstance.getInfoArticulo(idArticulo)).nombre;
                        return {
                            cantidadPromos,
                            sobran,
                            precioConIva: this.promosIndividuales[i].precioFinal*cantidadPromos*this.promosIndividuales[i].cantidadSecundario,
                            idPromocion: this.promosIndividuales[i]._id,
                            nombreArticulo,
                            idArticulo,
                            cantidadNecesaria: this.promosIndividuales[i].cantidadSecundario,
                            precioUnidad: this.promosIndividuales[i].precioFinal
                        };
                    }
                }
            }
        }
        return null;
    }

    private buscarPromocionesComboPrincipal(idArticulo1: ArticulosInterface["_id"], unidadesTotales1: number) {
        for (let i = 0; i < this.promosCombo.length; i++) {
            if (this.promosCombo[i].principal && this.promosCombo[i].principal.length > 0) { // Buscar comenzando por el secundario en el else
                for (let j = 0; j < this.promosCombo[i].principal.length; j++) {
                    if (this.promosCombo[i].principal[j] === idArticulo1 && unidadesTotales1 >= this.promosCombo[i].cantidadPrincipal) {
                        const cantidadPromos = Math.trunc(unidadesTotales1/this.promosCombo[i].cantidadPrincipal);
                        const sobran = unidadesTotales1%this.promosCombo[i].cantidadPrincipal;
                        return { indexPromo: i, cantidadPromos, sobran };
                    }
                }
            }
        }
        return null;
    }

    private buscarPromocionesComboSecundario(idArticulo1: ArticulosInterface["_id"], unidadesTotales1: number) {
        for (let i = 0; i < this.promosCombo.length; i++) {
            if (this.promosCombo[i].secundario && this.promosCombo[i].secundario.length > 0) { // Buscar comenzando por el secundario en el else
                for (let j = 0; j < this.promosCombo[i].secundario.length; j++) {
                    if (this.promosCombo[i].secundario[j] === idArticulo1 && unidadesTotales1 >= this.promosCombo[i].cantidadSecundario) {
                        const cantidadPromos = Math.trunc(unidadesTotales1/this.promosCombo[i].cantidadSecundario);
                        const sobran = unidadesTotales1%this.promosCombo[i].cantidadSecundario;
                        return { indexPromo: i, cantidadPromos, sobran };
                    }
                }
            }
        }
        return null;
    }

    private aplicarPromoIndividual(cesta: CestasInterface, data: InfoPromocionIndividual) {
        cesta.lista.push({
            arraySuplementos: null,
            gramos: 0,
            idArticulo: -1,
            unidades: data.cantidadPromos,
            nombre: "Promo. " + data.nombreArticulo,
            regalo: false,
            subtotal: data.precioConIva,
            promocion: {
                idPromocion: data.idPromocion,
                tipoPromo: "INDIVIDUAL",
                unidadesOferta: data.cantidadPromos,
                idArticuloPrincipal: data.idArticulo,
                cantidadArticuloPrincipal: data.cantidadNecesaria,
                cantidadArticuloSecundario: null,
                idArticuloSecundario: null,
                precioRealArticuloPrincipal: data.precioUnidad,
                precioRealArticuloSecundario: null
            }
        });
    }

    private aplicarPromoCombo(cesta: CestasInterface, data: InfoPromocionCombo, articuloPrincipal: ArticulosInterface, articuloSecundario: ArticulosInterface, preciosReales: PreciosReales) {
        cesta.lista.push({
            arraySuplementos: null,
            gramos: 0,
            idArticulo: -1,
            unidades: data.seAplican,
            nombre: `Promo. ${ articuloPrincipal.nombre } + ${ articuloSecundario.nombre }`,
            regalo: false,
            subtotal: data.precioPromoUnitario*data.seAplican, // No será necesario, se hace desde el recalcularIvas Cesta
            promocion: {
                idPromocion: data.idPromocion,
                tipoPromo: "COMBO",
                unidadesOferta: data.seAplican,
                idArticuloPrincipal: data.idArticuloPrincipal,
                cantidadArticuloPrincipal: data.cantidadNecesariaPrincipal,
                cantidadArticuloSecundario: data.cantidadNecesariaSecundario,
                idArticuloSecundario: data.idArticuloSecundario,
                precioRealArticuloPrincipal: preciosReales.precioRealPrincipal,
                precioRealArticuloSecundario: preciosReales.precioRealSecundario
            }
        });
    }

    calcularPrecioRealCombo(
        data: InfoPromocionCombo,
        articuloPrincipal: ArticulosInterface,
        articuloSecundario: ArticulosInterface
    ): PreciosReales {

    let precioTotalSinOferta = 0;

    const precioSinOfertaPrincipal = articuloPrincipal.precioConIva;
    const precioSinOfertaSecundario = articuloSecundario.precioConIva;   

    precioTotalSinOferta = (precioSinOfertaPrincipal * data.cantidadNecesariaPrincipal + precioSinOfertaSecundario * data.cantidadNecesariaSecundario) * data.seAplican;
    
    const dto = (precioTotalSinOferta - data.precioPromoUnitario) / precioTotalSinOferta;

    const precioRealPrincipalDecimales = ((precioSinOfertaPrincipal - precioSinOfertaPrincipal * dto) * data.seAplican) % 1;
    const precioRealSecundarioDecimales = ((precioSinOfertaSecundario - precioSinOfertaSecundario * dto) * data.seAplican) % 1;

    if (
      Math.round(
        (precioRealPrincipalDecimales * data.cantidadNecesariaPrincipal +
          precioRealSecundarioDecimales * data.cantidadNecesariaSecundario) *
          100
      ) /
        100 ===
      1
    ) {
      const sumaCentimos = 0.01 / data.cantidadNecesariaPrincipal;
      return {
        precioRealPrincipal:
          Math.round(
            (precioSinOfertaPrincipal - precioSinOfertaPrincipal * dto) *
              data.seAplican *
              100
          ) /
            100 +
          sumaCentimos,
        precioRealSecundario:
          Math.round(
            (precioSinOfertaSecundario - precioSinOfertaSecundario * dto) *
              data.seAplican *
              100
          ) / 100,
      };
    }

    return {
      precioRealPrincipal:
        Math.round(
          (precioSinOfertaPrincipal - precioSinOfertaPrincipal * dto) *
            data.seAplican *
            100
        ) / 100,
      precioRealSecundario:
        Math.round(
          (precioSinOfertaSecundario - precioSinOfertaSecundario * dto) *
            data.seAplican *
            100
        ) / 100,
    };
  }

    private deleteIndexCestaCombo(cesta: CestasInterface, indexPrincipal: number, indexSecundario: number) {
        const deleteIndexes: number[] = [];
        if (indexPrincipal != null && indexPrincipal != undefined) {
            deleteIndexes.push(indexPrincipal);
        }

        if (indexSecundario != null && indexSecundario != undefined) {
            deleteIndexes.push(indexSecundario);
        }
        deleteIndexes.sort();
        for (let i = deleteIndexes.length -1; i >= 0; i--) {
            cesta.lista.splice(deleteIndexes[i], 1);
        }
    }

    private aplicarSobraIndividual(cesta: CestasInterface, idArticulo: ArticulosInterface["_id"], data: InfoPromocionIndividual) {
        cesta.lista.push({
            arraySuplementos: null,
            gramos: 0,
            idArticulo,
            nombre: data.nombreArticulo,
            promocion: null,
            regalo: false,
            subtotal: null,
            unidades: data.sobran
        });
    }

    private aplicarSobraComboPrincipal(cesta: CestasInterface, data: InfoPromocionCombo) {
        cesta.lista.push({
            arraySuplementos: null,
            gramos: 0,
            idArticulo: data.idArticuloPrincipal,
            nombre: data.nombrePrincipal,
            promocion: null,
            regalo: false,
            subtotal: null,
            unidades: data.sobranPrincipal
        });
    }
    private aplicarSobraComboSecundario(cesta: CestasInterface, data: InfoPromocionCombo) {
        cesta.lista.push({
            arraySuplementos: null,
            gramos: 0,
            idArticulo: data.idArticuloSecundario,
            nombre: data.nombreSecundario,
            promocion: null,
            regalo: false,
            subtotal: null,
            unidades: data.sobranSecundario
        });
    }

  /* Eze 4.0 */
  public insertarPromociones = async (
    arrayPromociones: PromocionesInterface[]
  ) => await schPromociones.insertarPromociones(arrayPromociones);
}

export const nuevaInstancePromociones = new NuevaPromocion();