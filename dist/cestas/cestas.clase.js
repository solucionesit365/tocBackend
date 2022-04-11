"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cestas = exports.CestaClase = void 0;
const schCestas = require("./cestas.mongodb");
const funciones_1 = require("../funciones/funciones");
const articulos_clase_1 = require("../articulos/articulos.clase");
const promociones_clase_1 = require("../promociones/promociones.clase");
const caja_clase_1 = require("../caja/caja.clase");
const impresora_class_1 = require("../impresora/impresora.class");
const trabajadores_clase_1 = require("../trabajadores/trabajadores.clase");
const axios_1 = require("axios");
const parametros_clase_1 = require("../parametros/parametros.clase");
class CestaClase {
    constructor() {
        schCestas.getUnaCesta().then((respuesta) => {
            if (respuesta != undefined && respuesta != null && respuesta.lista.length != 0 && respuesta._id != null) {
                for (let i = 0; i < respuesta.lista.length; i++) {
                    respuesta.lista[i].subtotal = Number(respuesta.lista[i].subtotal.toFixed(2));
                }
                this.cesta = respuesta;
            }
            else {
                this.cesta = (0, funciones_1.crearCestaVacia)();
            }
        });
        this.udsAplicar = 1;
    }
    async updateIdCestaTrabajador(id) {
        return schCestas.updateIdCestaTrabajador(id).then((res) => {
            return res.acknowledged;
        }).catch((err) => {
            console.log(err);
            return false;
        });
    }
    getCesta(idCesta) {
        return schCestas.getCestaConcreta(idCesta);
    }
    getCestaRandom() {
        return schCestas.getUnaCesta().then((cesta) => {
            if (cesta != null) {
                return cesta;
            }
            else {
                const nueva = this.nuevaCestaVacia();
                return this.setCesta(nueva).then((resultado) => {
                    if (resultado) {
                        return nueva;
                    }
                    else {
                        throw "Error al crear nueva cesta vacía (por que no hay ninguna)";
                    }
                }).catch((err) => {
                    throw err;
                });
            }
        }).catch((err) => {
            console.log(err);
            return null;
        });
    }
    reiniciarCesta(idCestaBorrar) {
        return this.borrarCesta(idCestaBorrar).then(() => {
            return this.getTodasCestas().then((res) => {
                if (res.length > 0) {
                    return res[0];
                }
                else {
                    const nuevaCesta = this.nuevaCestaVacia();
                    this.setCesta(nuevaCesta);
                    return nuevaCesta;
                }
            });
        });
    }
    borrarCestaActiva() {
        return parametros_clase_1.parametrosInstance.getEspecialParametros().then((parametros) => {
            return schCestas.eliminarCestaByIdTrabajador(parametros.idCurrentTrabajador).then((res) => {
                return res.acknowledged;
            }).catch((err) => {
                console.log(err.message);
                return false;
            });
        });
    }
    nuevaCestaVacia() {
        const nuevaCesta = {
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
            nombreCesta: 'PRINCIPAL',
            idTrabajador: parametros_clase_1.parametrosInstance.getParametros().idCurrentTrabajador
        };
        return nuevaCesta;
    }
    getTodasCestas() {
        return schCestas.getAllCestas();
    }
    borrarCesta(idCestaBorrar) {
        return schCestas.borrarCesta(idCestaBorrar).then((res) => {
            return res.acknowledged;
        }).catch((err) => {
            console.log(err);
            return false;
        });
    }
    eliminarCesta(nombreCesta) {
        return schCestas.eliminarCesta(nombreCesta).then((res) => {
            return res.acknowledged;
        }).catch((err) => {
            console.log(err);
            return false;
        });
    }
    setCesta(cesta) {
        for (let i = 0; i < cesta.lista.length; i++) {
            cesta.lista[i].subtotal = Number(cesta.lista[i].subtotal.toFixed(2));
        }
        return schCestas.setCesta(cesta).then((res) => {
            if (res.acknowledged) {
                return true;
            }
            else {
                return false;
            }
        }).catch((err) => {
            console.log(err);
            return false;
        });
    }
    async crearNuevaCesta(nombreCesta) {
        if (!nombreCesta || nombreCesta === '' || nombreCesta === ' ')
            return false;
        const nuevaCesta = this.nuevaCestaVacia();
        nuevaCesta.nombreCesta = nombreCesta;
        return this.setCesta(nuevaCesta).then((res) => {
            if (res) {
                return nuevaCesta;
            }
            else {
                return false;
            }
        }).catch((err) => {
            console.log(err);
            return false;
        });
    }
    async crearCestaParaTrabajador(idTrabajador) {
        if (typeof idTrabajador == 'number') {
            let nuevaCesta = this.nuevaCestaVacia();
            nuevaCesta.idTrabajador = idTrabajador;
            return this.setCesta(nuevaCesta).then((res) => {
                if (res) {
                    return nuevaCesta;
                }
                else {
                    return false;
                }
            }).catch((err) => {
                console.log(err);
                return false;
            });
        }
        else {
            return false;
        }
    }
    borrarItemCesta(idCesta, idArticulo) {
        return this.getCesta(idCesta).then((cesta) => {
            for (let i = 0; i < cesta.lista.length; i++) {
                if (cesta.lista[i]._id == idArticulo) {
                    cesta.lista.splice(i, 1);
                    break;
                }
            }
            return this.recalcularIvas(cesta).then((cestaRecalculada) => {
                return this.setCesta(cestaRecalculada).then((result) => {
                    if (result) {
                        return cestaRecalculada;
                    }
                    else {
                        return false;
                    }
                }).catch((err) => {
                    console.log(err);
                    return false;
                });
            }).catch((err) => {
                console.log(err);
                return false;
            });
        }).catch((err) => {
            console.log(err);
            return false;
        });
    }
    async limpiarCesta(unaCesta, posicionPrincipal, posicionSecundario, sobraCantidadPrincipal, sobraCantidadSecundario, pideDelA, pideDelB) {
        if (pideDelA != -1) {
            if (sobraCantidadPrincipal > 0) {
                const datosArticulo = await articulos_clase_1.articulosInstance.getInfoArticulo(unaCesta.lista[posicionPrincipal]._id);
                unaCesta.lista[posicionPrincipal].unidades = sobraCantidadPrincipal;
                unaCesta.lista[posicionPrincipal].subtotal = sobraCantidadPrincipal * datosArticulo.precioConIva;
            }
            else {
                unaCesta.lista.splice(posicionPrincipal, 1);
            }
        }
        if (pideDelB != -1) {
            if (sobraCantidadSecundario > 0) {
                const datosArticulo = await articulos_clase_1.articulosInstance.getInfoArticulo(unaCesta.lista[posicionSecundario]._id);
                unaCesta.lista[posicionSecundario].unidades = sobraCantidadSecundario;
                unaCesta.lista[posicionSecundario].subtotal = sobraCantidadSecundario * datosArticulo.precioConIva;
            }
            else {
                if (posicionSecundario > posicionPrincipal) {
                    unaCesta.lista.splice(posicionSecundario - 1, 1);
                }
                else {
                    unaCesta.lista.splice(posicionSecundario, 1);
                }
            }
        }
        return unaCesta;
    }
    async insertarArticuloCesta(infoArticulo, unidades, idCesta, infoAPeso = null) {
        var miCesta = await this.getCesta(idCesta);
        if (miCesta.lista.length > 0) {
            let encontrado = false;
            if (!infoArticulo.suplementos) {
                for (let i = 0; i < miCesta.lista.length; i++) {
                    if (miCesta.lista[i]._id === infoArticulo._id) {
                        var viejoIva = miCesta.tiposIva;
                        if (infoAPeso == null) {
                            miCesta.lista[i].unidades += unidades;
                            miCesta.lista[i].subtotal += unidades * infoArticulo.precioConIva;
                            miCesta.tiposIva = (0, funciones_1.construirObjetoIvas)(infoArticulo, unidades, viejoIva);
                        }
                        else {
                            miCesta.lista[i].subtotal += infoAPeso.precioAplicado;
                            miCesta.tiposIva = (0, funciones_1.construirObjetoIvas)(infoArticulo, unidades, viejoIva, infoAPeso);
                        }
                        encontrado = true;
                        break;
                    }
                }
            }
            if (!encontrado) {
                if (infoAPeso == null) {
                    miCesta.lista.push({ _id: infoArticulo._id, nombre: infoArticulo.nombre, unidades: unidades, promocion: { esPromo: false, _id: null }, subtotal: unidades * infoArticulo.precioConIva });
                    miCesta.tiposIva = (0, funciones_1.construirObjetoIvas)(infoArticulo, unidades, miCesta.tiposIva);
                }
                else {
                    miCesta.lista.push({ _id: infoArticulo._id, nombre: infoArticulo.nombre, unidades: unidades, promocion: { esPromo: false, _id: null }, subtotal: infoAPeso.precioAplicado });
                    miCesta.tiposIva = (0, funciones_1.construirObjetoIvas)(infoArticulo, unidades, miCesta.tiposIva, infoAPeso);
                }
            }
        }
        else {
            if (infoAPeso == null) {
                miCesta.lista.push({ _id: infoArticulo._id, nombre: infoArticulo.nombre, unidades: unidades, promocion: { esPromo: false, _id: null }, subtotal: unidades * infoArticulo.precioConIva });
                miCesta.tiposIva = (0, funciones_1.construirObjetoIvas)(infoArticulo, unidades, miCesta.tiposIva);
            }
            else {
                miCesta.lista.push({ _id: infoArticulo._id, nombre: infoArticulo.nombre, unidades: unidades, promocion: { esPromo: false, _id: null }, subtotal: infoAPeso.precioAplicado });
                miCesta.tiposIva = (0, funciones_1.construirObjetoIvas)(infoArticulo, unidades, miCesta.tiposIva, infoAPeso);
            }
        }
        const temporal = await promociones_clase_1.ofertas.buscarOfertas(miCesta, viejoIva);
        return temporal;
    }
    async addItem(idArticulo, idBoton, aPeso, infoAPeso, idCesta, unidades = 1) {
        var cestaRetornar = null;
        let infoArticulo;
        if (caja_clase_1.cajaInstance.cajaAbierta()) {
            try {
                if (!aPeso) {
                    infoArticulo = await articulos_clase_1.articulosInstance.getInfoArticulo(idArticulo);
                    if (infoArticulo) {
                        if (infoArticulo.suplementos) {
                            await this.insertarArticuloCesta(infoArticulo, unidades, idCesta);
                            return {
                                suplementos: true,
                                data: await articulos_clase_1.articulosInstance.getSuplementos(infoArticulo.suplementos),
                            };
                        }
                        else {
                            cestaRetornar = await this.insertarArticuloCesta(infoArticulo, unidades, idCesta);
                        }
                    }
                    else {
                    }
                }
                else {
                    infoArticulo = await articulos_clase_1.articulosInstance.getInfoArticulo(idArticulo);
                    cestaRetornar = await this.insertarArticuloCesta(infoArticulo, 1, idCesta, infoAPeso);
                }
                if (cestaRetornar != undefined && cestaRetornar != null) {
                    if (cestaRetornar.tiposIva != undefined && cestaRetornar.tiposIva != null) {
                        trabajadores_clase_1.trabajadoresInstance.getCurrentTrabajador().then((data) => {
                            try {
                                impresora_class_1.impresoraInstance.mostrarVisor({
                                    dependienta: data.nombre,
                                    total: (cestaRetornar.tiposIva.importe1 + cestaRetornar.tiposIva.importe2 + cestaRetornar.tiposIva.importe3).toFixed(2),
                                    precio: infoArticulo.precioConIva.toString(),
                                    texto: infoArticulo.nombre,
                                });
                            }
                            catch (err) {
                                console.log(err);
                            }
                        });
                    }
                }
            }
            catch (err) {
                console.log(err);
                this.udsAplicar = 1;
            }
        }
        else {
            console.log('Error: La caja está cerrada, no se puede insertar un articulo en la cesta');
        }
        this.udsAplicar = 1;
        return cestaRetornar;
    }
    setUnidadesAplicar(unidades) {
        this.udsAplicar = unidades;
    }
    async recalcularIvas(cesta) {
        cesta.tiposIva = {
            base1: 0,
            base2: 0,
            base3: 0,
            valorIva1: 0,
            valorIva2: 0,
            valorIva3: 0,
            importe1: 0,
            importe2: 0,
            importe3: 0
        };
        for (let i = 0; i < cesta.lista.length; i++) {
            if (cesta.lista[i].promocion.esPromo === false) {
                let infoArticulo = await articulos_clase_1.articulosInstance.getInfoArticulo(cesta.lista[i]._id);
                cesta.tiposIva = (0, funciones_1.construirObjetoIvas)(infoArticulo, cesta.lista[i].unidades, cesta.tiposIva);
            }
            else if (cesta.lista[i].promocion.esPromo === true) {
                if (cesta.lista[i].nombre == 'Oferta combo') {
                    let infoArticuloPrincipal = await articulos_clase_1.articulosInstance.getInfoArticulo(cesta.lista[i].promocion.infoPromo.idPrincipal);
                    infoArticuloPrincipal.precioConIva = cesta.lista[i].promocion.infoPromo.precioRealPrincipal;
                    cesta.tiposIva = (0, funciones_1.construirObjetoIvas)(infoArticuloPrincipal, cesta.lista[i].promocion.infoPromo.unidadesOferta * cesta.lista[i].promocion.infoPromo.cantidadPrincipal, cesta.tiposIva);
                    let infoArticuloSecundario = await articulos_clase_1.articulosInstance.getInfoArticulo(cesta.lista[i].promocion.infoPromo.idSecundario);
                    infoArticuloSecundario.precioConIva = cesta.lista[i].promocion.infoPromo.precioRealSecundario;
                    cesta.tiposIva = (0, funciones_1.construirObjetoIvas)(infoArticuloSecundario, cesta.lista[i].promocion.infoPromo.unidadesOferta * cesta.lista[i].promocion.infoPromo.cantidadSecundario, cesta.tiposIva);
                }
                else {
                    if (cesta.lista[i].nombre == 'Oferta individual') {
                        let infoArticulo = await articulos_clase_1.articulosInstance.getInfoArticulo(cesta.lista[i].promocion.infoPromo.idPrincipal);
                        infoArticulo.precioConIva = cesta.lista[i].promocion.infoPromo.precioRealPrincipal / (cesta.lista[i].promocion.infoPromo.unidadesOferta * cesta.lista[i].promocion.infoPromo.cantidadPrincipal);
                        cesta.tiposIva = (0, funciones_1.construirObjetoIvas)(infoArticulo, cesta.lista[i].promocion.infoPromo.unidadesOferta * cesta.lista[i].promocion.infoPromo.cantidadPrincipal, cesta.tiposIva);
                    }
                }
            }
        }
        return cesta;
    }
    async borrarArticulosCesta(idCesta) {
        const cestaActual = await this.getCesta(idCesta);
        const vacia = this.nuevaCestaVacia();
        cestaActual.lista = vacia.lista;
        cestaActual.regalo = false;
        cestaActual.tiposIva = vacia.tiposIva;
        return this.setCesta(cestaActual).then((res) => {
            if (res) {
                return cestaActual;
            }
            return false;
        }).catch((err) => {
            console.log(err);
            return false;
        });
    }
    async addSuplemento(idCesta, suplementos, idArticulo, posArticulo = -100) {
        suplementos = suplementos.map(o => o.suplemento);
        const cestaActual = await this.getCesta(idCesta);
        cestaActual.lista = cestaActual.lista.reverse();
        let indexArticulo = posArticulo;
        if (posArticulo === -100)
            indexArticulo = cestaActual.lista.findIndex(i => i._id === idArticulo);
        console.log(indexArticulo);
        cestaActual.lista[indexArticulo].suplementosId = suplementos;
        for (let i in suplementos) {
            const idSuplemento = suplementos[i];
            const infoSuplemento = await articulos_clase_1.articulosInstance.getInfoArticulo(idSuplemento);
            cestaActual.lista[indexArticulo].subtotal += infoSuplemento.precioConIva;
            cestaActual.lista[indexArticulo].nombre += ` + ${infoSuplemento.nombre}`;
        }
        cestaActual.lista = cestaActual.lista.reverse();
        return this.setCesta(cestaActual).then((res) => {
            if (res)
                return cestaActual;
            return false;
        }).catch((err) => {
            console.log(err);
            return false;
        });
    }
    async modificarSuplementos(cestaId, idArticulo, posArticulo) {
        const cestaActual = await this.getCesta(cestaId);
        cestaActual.lista = cestaActual.lista.reverse();
        const indexArticulo = posArticulo;
        const suplementos = cestaActual.lista[indexArticulo].suplementosId;
        const infoArticulo = await articulos_clase_1.articulosInstance.getInfoArticulo(idArticulo);
        const suplementosArticulo = await articulos_clase_1.articulosInstance.getSuplementos(infoArticulo.suplementos);
        cestaActual.lista[indexArticulo].nombre = cestaActual.lista[indexArticulo].nombre.split('+')[0];
        cestaActual.lista[indexArticulo].suplementosId = [];
        for (let i = 0; i < suplementos.length; i++) {
            const dataArticulo = await articulos_clase_1.articulosInstance.getInfoArticulo(suplementos[i]);
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
    async enviarACocina(idCesta) {
        const cestaActual = await this.getCesta(idCesta);
        const nombreMesa = cestaActual.idCestaSincro ? cestaActual.idCestaSincro.split(' ')[0] === 'Taula' ? cestaActual.idCestaSincro : 'Barra' : 'Barra';
        let articulos = '';
        const suplementos = cestaActual.lista.map(i => ({ [i._id]: i.suplementosId ? i.suplementosId.map(o => o) : [] }));
        for (let i in suplementos) {
            const key = Object.keys(suplementos[i])[0];
            articulos += key;
            if (suplementos[i][key].length) {
                articulos += suplementos[i][key].map(i => `|${i}`).join('');
            }
            articulos += ',';
        }
        articulos = articulos.slice(0, -1);
        return axios_1.default.get(`http://gestiondelatienda.com/printer/cocina.php?id_tienda=${parametros_clase_1.parametrosInstance.getParametros().codigoTienda}&pedidos=${articulos}&empresa=${parametros_clase_1.parametrosInstance.getParametros().database}&mesa=${nombreMesa}`).then((res) => {
            return true;
        }).catch((err) => {
            return false;
        });
    }
    async getCestaDiferente(id_cesta) {
        return schCestas.getCestaDiferente(id_cesta).then((result) => {
            return result ? result : false;
        });
    }
    getCestaByTrabajadorID(idTrabajador) {
        return schCestas.getCestaByTrabajadorID(idTrabajador).then((res) => {
            if (res != null) {
                return res;
            }
            else {
                return this.crearCestaParaTrabajador(idTrabajador).then((resCesta) => {
                    if (resCesta) {
                        return resCesta;
                    }
                    return null;
                });
            }
        }).catch((err) => {
            console.log(err);
            return null;
        });
    }
}
exports.CestaClase = CestaClase;
const cestas = new CestaClase();
exports.cestas = cestas;
//# sourceMappingURL=cestas.clase.js.map