// 100%
import { ArticulosInterface } from "./articulos.interface";
import * as schArticulos from "./articulos.mongodb";

export class Articulos {
    public estadoTarifaVIP: boolean;
    constructor() {
        this.estadoTarifaVIP = false;
    }

    setEstadoTarifaEspecial(payload: boolean) {
        this.estadoTarifaVIP = payload;
    }

    getEstadoTarifaEspecial() {
        return this.estadoTarifaVIP;
    }

    /* Devuelve un articulo */
    async getInfoArticulo(idArticulo: number): Promise<ArticulosInterface> {
        if(this.getEstadoTarifaEspecial() != true) {
            return await schArticulos.getInfoArticulo(idArticulo);
        } else {
            return await schArticulos.getInfoArticuloTarifaEspecial(idArticulo);
        }
    }

    /* InsertMany de articulos o articulosEspeciales */
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
        console.log(resultado)
        return resultado;
    }
}
const articulosInstance = new Articulos();
export { articulosInstance };