"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tecladoInstance = exports.TecladoClase = void 0;
const axios_1 = require("axios");
const menus_clase_1 = require("../menus/menus.clase");
const articulos_clase_1 = require("../articulos/articulos.clase");
const parametros_clase_1 = require("../parametros/parametros.clase");
const promociones_clase_1 = require("../promociones/promociones.clase");
const schTeclas = require("./teclado.mongodb");
class TecladoClase {
    insertarTeclas(arrayTeclas) {
        return schTeclas.insertarTeclas(arrayTeclas).then((res) => {
            return res.acknowledged;
        }).catch((err) => {
            console.log(err);
            return false;
        });
    }
    actualizarTeclado() {
        return axios_1.default.post('articulos/descargarArticulosEspeciales', { database: parametros_clase_1.parametrosInstance.getParametros().database, codigoCliente: parametros_clase_1.parametrosInstance.getParametros().codigoTienda }).then((res) => {
            if (res.data.error == false) {
                return axios_1.default.post('menus/getMenus', { database: parametros_clase_1.parametrosInstance.getParametros().database, codigoTienda: parametros_clase_1.parametrosInstance.getParametros().codigoTienda }).then((resMenusSanPedro) => {
                    return menus_clase_1.menusInstance.insertarMenus(resMenusSanPedro.data.info).then((resMenus) => {
                        if (resMenus) {
                            return articulos_clase_1.articulosInstance.insertarArticulos(res.data.info).then((res2) => {
                                if (res2) {
                                    return axios_1.default.post('/teclas/descargarTeclados', { database: parametros_clase_1.parametrosInstance.getParametros().database, licencia: parametros_clase_1.parametrosInstance.getParametros().codigoTienda }).then((infoTeclados) => {
                                        if (infoTeclados.data.error == false) {
                                            return exports.tecladoInstance.insertarTeclas(infoTeclados.data.info).then((resultado) => {
                                                if (resultado) {
                                                    return axios_1.default.post('promociones/getPromociones', { database: parametros_clase_1.parametrosInstance.getParametros().database, codigoTienda: parametros_clase_1.parametrosInstance.getParametros().codigoTienda }).then((resPromociones) => {
                                                        if (resPromociones.data.error == false) {
                                                            return promociones_clase_1.ofertas.insertarPromociones(resPromociones.data.info).then((resInsertPromos) => {
                                                                if (resInsertPromos) {
                                                                    return { error: false };
                                                                }
                                                                else {
                                                                    return { error: true, mensaje: 'Backend: Error teclado/actualizarTeclado 5' };
                                                                }
                                                            }).catch((err) => {
                                                                console.log(err);
                                                                return { error: true, mensaje: 'Backend: Error teclado/actualizarTeclado 4 CATCH' };
                                                            });
                                                        }
                                                        else {
                                                            return { error: true, mensaje: resPromociones.data.mensaje };
                                                        }
                                                    }).catch((err) => {
                                                        console.log(err);
                                                        return { error: true, mensaje: 'Backend: Error teclado/actualizarTeclado 3' };
                                                    });
                                                }
                                                else {
                                                    return { error: true, mensaje: 'Backend: Error teclado/actualizarTeclado 2' };
                                                }
                                            }).catch((err) => {
                                                console.log(err);
                                                return { error: true, mensaje: 'Backend: Error teclado/actualizarTeclado try catch' };
                                            });
                                        }
                                        else {
                                            return { error: true, mensaje: infoTeclados.data.mensaje };
                                        }
                                    }).catch((err) => {
                                        console.log(err);
                                        return { error: true, mensaje: 'Backend: teclado/actualizarTeclado error en segundo post catch' };
                                    });
                                }
                                else {
                                    return { error: true, mensaje: 'Error backend en actualizarTeclado/insertarArticulos' };
                                }
                            }).catch((err) => {
                                console.log(err);
                                return { error: true, mensaje: 'Error backend en actualizarTeclado/insertarArticulos CATCH' };
                            });
                        }
                        else {
                            return { error: true, mensaje: 'Backend: Error insertar Menus teclados.clase.ts funcion' };
                        }
                    }).catch((err) => {
                        console.log(err);
                        return { error: true, mensaje: 'Backend: ERROR insertarMenus teclados.clase.ts' };
                    });
                }).catch((err) => {
                    console.log(err);
                    return { error: true, mensaje: 'Error backend POST actualizar teclado123' };
                });
            }
            else {
                return { error: true, mensaje: res.data.mensaje };
            }
        }).catch((err) => {
            console.log(err);
            return {
                error: true,
                mensaje: 'Backend: Error en catch actualizarArticulos'
            };
        });
    }
    async cambiarPosTecla(idArticle, nuevaPos, nombreMenu) {
        return await schTeclas.cambiarPosTecla(idArticle, nuevaPos, nombreMenu);
    }
}
exports.TecladoClase = TecladoClase;
exports.tecladoInstance = new TecladoClase();
//# sourceMappingURL=teclado.clase.js.map