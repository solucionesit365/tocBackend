"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ofertas = exports.OfertasClase = void 0;
const clientes_clase_1 = require("../clientes/clientes.clase");
const articulos_clase_1 = require("../articulos/articulos.clase");
const cestas_clase_1 = require("../cestas/cestas.clase");
const schPromociones = require("./promociones.mongodb");
class OfertasClase {
    constructor() {
        this.promocionesActivas = true;
        schPromociones.getPromociones().then((arrayPromos) => {
            if (arrayPromos.length > 0) {
                this.promociones = arrayPromos;
            }
            else {
                this.promociones = [];
            }
        });
    }
    deshacerOfertas(cesta) {
        for (let i = 0; i < cesta.lista.length; i++) {
            if (cesta.lista[i].promocion.esPromo) {
                const auxItemLista = cesta.lista[i];
                cesta.lista.splice(i, i);
                if (cesta.lista[i].promocion.infoPromo.idPrincipal != 0) {
                    const idPrincipal = cesta.lista[i].promocion.infoPromo.idPrincipal;
                    const unidades = cesta.lista[i].unidades * cesta.lista[i].promocion.infoPromo.cantidadPrincipal;
                    cestas_clase_1.cestas.addItem(idPrincipal, '', false, null, cesta._id, unidades);
                }
                if (cesta.lista[i].promocion.infoPromo.idSecundario != 0) {
                    const idSecundario = cesta.lista[i].promocion.infoPromo.idSecundario;
                    const unidades = cesta.lista[i].unidades * cesta.lista[i].promocion.infoPromo.cantidadSecundario;
                    cestas_clase_1.cestas.addItem(idSecundario, '', false, null, cesta._id, unidades);
                }
            }
        }
        return cesta;
    }
    existeArticuloParaOfertaEnCesta(cesta, idArticulo, unidadesNecesarias) {
        for (let i = 0; i < cesta.lista.length; i++) {
            if (cesta.lista[i]._id === idArticulo && cesta.lista[i].unidades >= unidadesNecesarias) {
                return i;
            }
        }
        return -1;
    }
    setEstadoPromociones(x) {
        this.promocionesActivas = x;
    }
    getEstadoPromociones() {
        return this.promocionesActivas;
    }
    async teLoAplicoTodo(necesariasPrincipal, necesariasSecundario, cesta, posicionPrincipal, posicionSecundario, pideDelA, pideDelB, precioPromo, idPromo) {
        if (this.getEstadoPromociones()) {
            let numeroPrincipal = 0;
            let numeroSecundario = 0;
            let sobranPrincipal = 0;
            let sobranSecundario = 0;
            let nVeces = 0;
            var idPrincipal = (typeof cesta.lista[posicionPrincipal] !== "undefined") ? cesta.lista[posicionPrincipal]._id : 0;
            var idSecundario = (typeof cesta.lista[posicionSecundario] !== "undefined") ? cesta.lista[posicionSecundario]._id : 0;
            if (pideDelA !== -1 && pideDelB !== -1) {
                numeroPrincipal = cesta.lista[posicionPrincipal].unidades / necesariasPrincipal;
                numeroSecundario = cesta.lista[posicionSecundario].unidades / necesariasSecundario;
                nVeces = Math.trunc(Math.min(numeroPrincipal, numeroSecundario));
                sobranPrincipal = cesta.lista[posicionPrincipal].unidades - nVeces * necesariasPrincipal;
                sobranSecundario = cesta.lista[posicionSecundario].unidades - nVeces * necesariasSecundario;
                cesta = await cestas_clase_1.cestas.limpiarCesta(cesta, posicionPrincipal, posicionSecundario, sobranPrincipal, sobranSecundario, pideDelA, pideDelB);
                cesta = await this.insertarLineaPromoCestaCombo(cesta, 1, nVeces, precioPromo * nVeces, idPromo, idPrincipal, idSecundario, necesariasPrincipal, necesariasSecundario);
            }
            else {
                if (pideDelA !== -1 && pideDelB === -1) {
                    numeroPrincipal = cesta.lista[posicionPrincipal].unidades / necesariasPrincipal;
                    nVeces = Math.trunc(numeroPrincipal);
                    sobranPrincipal = cesta.lista[posicionPrincipal].unidades - nVeces * necesariasPrincipal;
                    cesta = await cestas_clase_1.cestas.limpiarCesta(cesta, posicionPrincipal, posicionSecundario, sobranPrincipal, sobranSecundario, pideDelA, pideDelB);
                    cesta = await this.insertarLineaPromoCestaIndividual(cesta, 2, nVeces, precioPromo * nVeces * necesariasPrincipal, idPromo, idPrincipal, necesariasPrincipal);
                }
                else {
                    if (pideDelA === -1 && pideDelB !== -1) {
                        numeroSecundario = cesta.lista[posicionSecundario].unidades / necesariasSecundario;
                        nVeces = Math.trunc(numeroSecundario);
                        sobranSecundario = cesta.lista[posicionSecundario].unidades - nVeces * necesariasSecundario;
                        cesta = await cestas_clase_1.cestas.limpiarCesta(cesta, posicionPrincipal, posicionSecundario, sobranPrincipal, sobranSecundario, pideDelA, pideDelB);
                        cesta = await this.insertarLineaPromoCestaIndividual(cesta, 2, nVeces, precioPromo * nVeces * necesariasSecundario, idPromo, idPrincipal, necesariasPrincipal);
                    }
                }
            }
        }
        return cesta;
    }
    async buscarOfertas(unaCesta, viejoIva) {
        var hayOferta = false;
        if (clientes_clase_1.clienteInstance.getEstadoClienteVIP() == false) {
            for (let i = 0; i < this.promociones.length; i++) {
                for (let j = 0; j < this.promociones[i].principal.length; j++) {
                    let preguntaPrincipal = this.existeArticuloParaOfertaEnCesta(unaCesta, this.promociones[i].principal[j]._id, this.promociones[i].cantidadPrincipal);
                    if (this.promociones[i].principal[j]._id === -1 || preguntaPrincipal >= 0) {
                        for (let z = 0; z < this.promociones[i].secundario.length; z++) {
                            let preguntaSecundario = this.existeArticuloParaOfertaEnCesta(unaCesta, this.promociones[i].secundario[z]._id, this.promociones[i].cantidadSecundario);
                            if (this.promociones[i].secundario[z]._id === -1 || preguntaSecundario >= 0) {
                                unaCesta = await this.teLoAplicoTodo(this.promociones[i].cantidadPrincipal, this.promociones[i].cantidadSecundario, unaCesta, preguntaPrincipal, preguntaSecundario, this.promociones[i].principal[j]._id, this.promociones[i].secundario[z]._id, this.promociones[i].precioFinal, this.promociones[i]._id);
                                hayOferta = true;
                                break;
                            }
                        }
                    }
                }
            }
            if (hayOferta) {
                unaCesta.tiposIva = viejoIva;
                unaCesta = await cestas_clase_1.cestas.recalcularIvas(unaCesta);
            }
        }
        cestas_clase_1.cestas.setCesta(unaCesta);
        return unaCesta;
    }
    async insertarLineaPromoCestaCombo(cesta, tipoPromo, unidades, total, idPromo, idPrincipal, idSecundario, cantidadPrincipal, cantidadSecundario) {
        var dtoAplicado = await this.calcularPrecioRealCombo(tipoPromo, idPrincipal, idSecundario, cantidadPrincipal, cantidadSecundario, unidades, total);
        if (tipoPromo === 1) {
            cesta.lista.push({
                _id: -2,
                nombre: 'Oferta combo',
                unidades: unidades,
                subtotal: total,
                promocion: {
                    _id: idPromo,
                    esPromo: true,
                    infoPromo: {
                        idPrincipal: idPrincipal,
                        cantidadPrincipal: cantidadPrincipal,
                        idSecundario: idSecundario,
                        cantidadSecundario: cantidadSecundario,
                        precioRealPrincipal: dtoAplicado.precioRealPrincipal,
                        precioRealSecundario: dtoAplicado.precioRealSecundario,
                        unidadesOferta: unidades,
                        tipoPromo: 'COMBO'
                    }
                }
            });
        }
        return cesta;
    }
    async insertarLineaPromoCestaIndividual(cesta, tipoPromo, unidades, total, idPromo, idPrincipal, cantidadPrincipal) {
        var dtoAplicado = await this.calcularPrecioRealIndividual(tipoPromo, idPrincipal, cantidadPrincipal, unidades, total);
        if (tipoPromo === 2) {
            cesta.lista.push({
                _id: -2,
                nombre: 'Oferta individual',
                unidades: unidades,
                subtotal: total,
                promocion: {
                    _id: idPromo,
                    esPromo: true,
                    infoPromo: {
                        idPrincipal: idPrincipal,
                        cantidadPrincipal: cantidadPrincipal,
                        idSecundario: 0,
                        cantidadSecundario: 0,
                        precioRealPrincipal: dtoAplicado.precioRealPrincipal,
                        precioRealSecundario: 0,
                        unidadesOferta: unidades,
                        tipoPromo: 'INDIVIDUAL'
                    }
                }
            });
        }
        return cesta;
    }
    async calcularPrecioRealCombo(tipoPromo, idPrincipal, idSecundario, cantidadPrincipal, cantidadSecundario, unidadesOferta, precioTotalOferta) {
        let precioSinOfertaPrincipal = 0;
        let precioSinOfertaSecundario = 0;
        let precioTotalSinOferta = 0;
        if (idPrincipal != 0) {
            precioSinOfertaPrincipal = (await articulos_clase_1.articulosInstance.getInfoArticulo(idPrincipal)).precioConIva;
        }
        if (idSecundario != 0) {
            precioSinOfertaSecundario = (await articulos_clase_1.articulosInstance.getInfoArticulo(idSecundario)).precioConIva;
        }
        if (tipoPromo === 1) {
            precioTotalSinOferta = (precioSinOfertaPrincipal * cantidadPrincipal + precioSinOfertaSecundario * cantidadSecundario) * unidadesOferta;
        }
        var dto = (precioTotalSinOferta - precioTotalOferta) / precioTotalSinOferta;
        let precioRealPrincipalDecimales = ((precioSinOfertaPrincipal - (precioSinOfertaPrincipal * dto)) * unidadesOferta) % 1;
        let precioRealSecundarioDecimales = ((precioSinOfertaSecundario - (precioSinOfertaSecundario * dto)) * unidadesOferta) % 1;
        if (Math.round((precioRealPrincipalDecimales * cantidadPrincipal + precioRealSecundarioDecimales * cantidadSecundario) * 100) / 100 === 1) {
            let sumaCentimos = 0.01 / cantidadPrincipal;
            return {
                precioRealPrincipal: (Math.round((precioSinOfertaPrincipal - (precioSinOfertaPrincipal * dto)) * unidadesOferta * 100) / 100) + sumaCentimos,
                precioRealSecundario: Math.round((precioSinOfertaSecundario - (precioSinOfertaSecundario * dto)) * unidadesOferta * 100) / 100
            };
        }
        return {
            precioRealPrincipal: Math.round((precioSinOfertaPrincipal - (precioSinOfertaPrincipal * dto)) * unidadesOferta * 100) / 100,
            precioRealSecundario: Math.round((precioSinOfertaSecundario - (precioSinOfertaSecundario * dto)) * unidadesOferta * 100) / 100
        };
    }
    async calcularPrecioRealIndividual(tipoPromo, idPrincipal, cantidadPrincipal, unidadesOferta, precioTotalOferta) {
        let precioSinOfertaPrincipal = 0;
        let precioTotalSinOferta = 0;
        if (idPrincipal != 0) {
            precioSinOfertaPrincipal = (await articulos_clase_1.articulosInstance.getInfoArticulo(idPrincipal)).precioConIva;
        }
        if (tipoPromo === 2) {
            if (idPrincipal != 0) {
                precioTotalSinOferta = precioSinOfertaPrincipal * cantidadPrincipal * unidadesOferta;
            }
        }
        var dto = (precioTotalSinOferta - precioTotalOferta) / precioTotalSinOferta;
        return {
            precioRealPrincipal: Math.round((precioSinOfertaPrincipal - (precioSinOfertaPrincipal * dto)) * unidadesOferta * cantidadPrincipal * 100) / 100
        };
    }
    insertarPromociones(arrayPromociones) {
        if (arrayPromociones.length > 0) {
            return schPromociones.insertarPromociones(arrayPromociones).then((res) => {
                if (res) {
                    this.promociones = arrayPromociones;
                }
                return res.acknowledged;
            }).catch((err) => {
                console.log(err);
                return false;
            });
        }
        else {
            return this.devuelveTrue();
        }
    }
    async devuelveTrue() {
        return true;
    }
    descargarPromociones() {
        return schPromociones.getPromociones().then((arrayPromos) => {
            if (arrayPromos.length > 0) {
                this.promociones = arrayPromos;
                return this.insertarPromociones(arrayPromos).then((res) => {
                    return res;
                }).catch((err) => {
                    console.log(err);
                    return false;
                });
            }
            else {
                this.promociones = [];
                return true;
            }
        }).catch((err) => {
            console.log(err);
            return false;
        });
    }
}
exports.OfertasClase = OfertasClase;
const ofertas = new OfertasClase();
exports.ofertas = ofertas;
//# sourceMappingURL=promociones.clase.js.map