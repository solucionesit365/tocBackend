import { Iva } from '../tickets/tickets.interface';

function redondearPrecio(precio) /* REDONDEA AL SEGUNDO DECIMAL */
{
  return Math.round(precio * 100) / 100;
}

export function construirObjetoIvas(precioConIva: number, tipoIva: number, unidades: number, objetoIvaAnterior: Iva, precioPesaje: number = null): Iva {
  let base1 = 0; let base2 = 0; let base3 = 0;

  let valor1 = 0; let valor2 = 0; let valor3 = 0;
  let importe1 = 0; let importe2 = 0; let importe3 = 0;

  let precio: number = null;
  if (precioPesaje) precio = precioPesaje;
  precio = precioConIva;

  switch (tipoIva) {
    case 1: base1 = (precio / 1.04) * unidades; valor1 = (precio / 1.04) * 0.04 * unidades; importe1 = precio * unidades; break;
    case 2: base2 = (precio / 1.10) * unidades; valor2 = (precio / 1.10) * 0.10 * unidades; importe2 = precio * unidades; break;
    case 3: base3 = (precio / 1.21) * unidades; valor3 = (precio / 1.21) * 0.21 * unidades; importe3 = precio * unidades; break;
    default: break;
  }
  
  const aux = {
    base1: redondearPrecio(base1 + objetoIvaAnterior.base1),
    base2: redondearPrecio(base2 + objetoIvaAnterior.base2),
    base3: redondearPrecio(base3 + objetoIvaAnterior.base3),
    valorIva1: redondearPrecio(valor1 + objetoIvaAnterior.valorIva1),
    valorIva2: redondearPrecio(valor2 + objetoIvaAnterior.valorIva2),
    valorIva3: redondearPrecio(valor3 + objetoIvaAnterior.valorIva3),
    importe1: redondearPrecio(importe1 + objetoIvaAnterior.importe1),
    importe2: redondearPrecio(importe2 + objetoIvaAnterior.importe2),
    importe3: redondearPrecio(importe3 + objetoIvaAnterior.importe3),
  };

  return aux;
}
export function convertirPuntosEnDinero(puntos: number): number {
  return Math.trunc(puntos*0.03*0.02);
}
export function crearCestaVacia() {
  const cestaVacia = {
    _id: Date.now(),
    tiposIva: {
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
    idTrabajador: null,
  };
  return cestaVacia;
}
