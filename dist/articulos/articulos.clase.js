"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.articulosInstance = exports.Articulos = void 0;
const schArticulos = require("./articulos.mongodb");
class Articulos {
    constructor() {
        this.estadoTarifaVIP = false;
    }
    setEstadoTarifaEspecial(payload) {
        this.estadoTarifaVIP = payload;
    }
    getEstadoTarifaEspecial() {
        return this.estadoTarifaVIP;
    }
    async getInfoArticulo(idArticulo) {
        if (this.getEstadoTarifaEspecial() != true) {
            return await schArticulos.getInfoArticulo(idArticulo);
        }
        else {
            return await schArticulos.getInfoArticuloTarifaEspecial(idArticulo);
        }
    }
    insertarArticulos(arrayArticulos, esTarifaEspecial = false) {
        return schArticulos.insertarArticulos(arrayArticulos, esTarifaEspecial).then((res) => {
            return res.acknowledged;
        }).catch((err) => {
            console.log(err);
            return false;
        });
    }
    setSuplemento(suplemento) {
        console.log(suplemento);
    }
    async getSuplementos(suplementos) {
        return await schArticulos.getSuplementos(suplementos);
    }
    async editarArticulo(id, nombre, precioBase, precioConIva) {
        const resultado = await schArticulos.editarArticulo(id, nombre, precioBase, precioConIva);
        console.log(resultado);
        return resultado;
    }
}
exports.Articulos = Articulos;
const articulosInstance = new Articulos();
exports.articulosInstance = articulosInstance;
//# sourceMappingURL=articulos.clase.js.map