import axios from "axios";
import { articulosInstance } from "src/articulos/articulos.clase";
import { ArticulosInterface } from "src/articulos/articulos.interface";
import { cestasInstance } from "src/cestas/cestas.clase";
import { CestasInterface } from "src/cestas/cestas.interface";
import { logger } from "src/logger";
import { PromocionesInterface, InfoPromocionIndividual } from "./promociones.interface";
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

        const promoIndividual = await this.buscarPromocionesIndividuales(idArticulo, unidadesTotales);
        if (promoIndividual) {
            if (index1 != null) cesta.lista.splice(index1, 1);
            this.aplicarPromoIndividual(cesta, promoIndividual);
            this.aplicarSobra(cesta, idArticulo, promoIndividual);
            return true;
        }
        // aquí falta gestionar las combo
        return false;
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

    // private async buscarPromocionesCombo() {
    //     console.log("aplicamosCombo");
    // }

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

    private aplicarSobra(cesta: CestasInterface, idArticulo: ArticulosInterface["_id"], data: InfoPromocionIndividual) {
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

  /* Eze 4.0 */
  public insertarPromociones = async (
    arrayPromociones: PromocionesInterface[]
  ) => await schPromociones.insertarPromociones(arrayPromociones);
}

export const nuevaInstancePromociones = new NuevaPromocion();