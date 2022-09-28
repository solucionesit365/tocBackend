import { TiposIva } from "../articulos/articulos.interface";

export interface CestasInterface {
  _id: number;
  detalleIva: DetalleIvaInterface,
  lista: ItemLista[],
  modo: ModoCesta
}

export type ItemLista = {
  idArticulo: number;
  nombre: string;
  unidades: number;
  subtotal: number;
  arraySuplementos: number[];
  promocion: {
    idPromocion: string;
    idArticuloPrincipal: number;
    cantidadArticuloPrincipal: number;
    idArticuloSecundario: number;
    cantidadArticuloSecundario: number;
    precioRealArticuloPrincipal: number;
    precioRealArticuloSecundario: number;
    unidadesOferta: number;
    tipoPromo: TiposPromociones;
  };
  tipoIva: TiposIva;
  precioConIva: number;
  precioPesaje: number;
  gramos: number,
  regalo: boolean;
};

export type DetalleIvaInterface = {
  base1: number,
  base2: number,
  base3: number,
  valorIva1: number,
  valorIva2: number,
  valorIva3: number,
  importe1: number,
  importe2: number,
  importe3: number
}

export type TiposPromociones = "COMBO" | "INDIVIDUAL";
export type ModoCesta = "VENTA" | "CONSUMO_PERSONAL" | "DEVOLUCION";