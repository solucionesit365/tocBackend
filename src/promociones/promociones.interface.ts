import { ArticulosInterface } from "../articulos/articulos.interface";

export interface PromocionesInterface {
  _id: string;
  cantidadPrincipal: number;
  cantidadSecundario: number;
  fechaFinal: string;
  fechaInicio: string;
  precioFinal: number;
  principal: number[];
  secundario: number[];
  tipo: "COMBO" | "INDIVIDUAL";
}

export interface InfoPromocionIndividual {
  sobran: number;
  cantidadPromos: number;
  precioConIva: number;
  idPromocion: string;
  nombreArticulo: string;
  idArticulo: ArticulosInterface["_id"];
  cantidadNecesaria: number;
  precioUnidad: number;
}

export interface InfoPromocionCombo {
  indexListaOriginalPrincipal: any;
  indexListaOriginalSecundario: number;
  seAplican: number;
  sobranPrincipal: number;
  sobranSecundario: number;
  idArticuloPrincipal: ArticulosInterface["_id"];
  idArticuloSecundario: ArticulosInterface["_id"];
  cantidadNecesariaPrincipal: number;
  cantidadNecesariaSecundario: number;
  precioPromoUnitario: number;
  idPromocion: PromocionesInterface["_id"];
  nombrePrincipal: string;
  nombreSecundario: string;
}

export interface PreciosReales {
  precioRealPrincipal: number;
  precioRealSecundario: number;
}
