"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.crearCestaVacia = exports.convertirPuntosEnDinero = exports.construirObjetoIvas = void 0;
function redondearPrecio(precio) {
    return Math.round(precio * 100) / 100;
}
function construirObjetoIvas(infoArticulo, unidades, tipoIvaAnterior, infoAPeso = null) {
    let base1 = 0, base2 = 0, base3 = 0;
    let valor1 = 0, valor2 = 0, valor3 = 0;
    let importe1 = 0, importe2 = 0, importe3 = 0;
    if (infoAPeso == null) {
        switch (infoArticulo.tipoIva) {
            case 1:
                base1 = (infoArticulo.precioConIva / 1.04) * unidades;
                valor1 = (infoArticulo.precioConIva / 1.04) * 0.04 * unidades;
                importe1 = infoArticulo.precioConIva * unidades;
                break;
            case 2:
                base2 = (infoArticulo.precioConIva / 1.10) * unidades;
                valor2 = (infoArticulo.precioConIva / 1.10) * 0.10 * unidades;
                importe2 = infoArticulo.precioConIva * unidades;
                break;
            case 3:
                base3 = (infoArticulo.precioConIva / 1.21) * unidades;
                valor3 = (infoArticulo.precioConIva / 1.21) * 0.21 * unidades;
                importe3 = infoArticulo.precioConIva * unidades;
                break;
            default: break;
        }
    }
    else {
        switch (infoArticulo.tipoIva) {
            case 1:
                base1 = (infoAPeso.precioAplicado / 1.04) * unidades;
                valor1 = (infoAPeso.precioAplicado / 1.04) * 0.04 * unidades;
                importe1 = infoAPeso.precioAplicado * unidades;
                break;
            case 2:
                base2 = (infoAPeso.precioAplicado / 1.10) * unidades;
                valor2 = (infoAPeso.precioAplicado / 1.10) * 0.10 * unidades;
                importe2 = infoAPeso.precioAplicado * unidades;
                break;
            case 3:
                base3 = (infoAPeso.precioAplicado / 1.21) * unidades;
                valor3 = (infoAPeso.precioAplicado / 1.21) * 0.21 * unidades;
                importe3 = infoAPeso.precioAplicado * unidades;
                break;
            default: break;
        }
    }
    const aux = {
        base1: redondearPrecio(base1 + tipoIvaAnterior.base1),
        base2: redondearPrecio(base2 + tipoIvaAnterior.base2),
        base3: redondearPrecio(base3 + tipoIvaAnterior.base3),
        valorIva1: redondearPrecio(valor1 + tipoIvaAnterior.valorIva1),
        valorIva2: redondearPrecio(valor2 + tipoIvaAnterior.valorIva2),
        valorIva3: redondearPrecio(valor3 + tipoIvaAnterior.valorIva3),
        importe1: redondearPrecio(importe1 + tipoIvaAnterior.importe1),
        importe2: redondearPrecio(importe2 + tipoIvaAnterior.importe2),
        importe3: redondearPrecio(importe3 + tipoIvaAnterior.importe3)
    };
    return aux;
}
exports.construirObjetoIvas = construirObjetoIvas;
function convertirPuntosEnDinero(puntos) {
    return Math.trunc(puntos * 0.03 * 0.02);
}
exports.convertirPuntosEnDinero = convertirPuntosEnDinero;
function crearCestaVacia() {
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
            importe3: 0
        },
        lista: [],
        idTrabajador: null
    };
    return cestaVacia;
}
exports.crearCestaVacia = crearCestaVacia;
//# sourceMappingURL=funciones.js.map