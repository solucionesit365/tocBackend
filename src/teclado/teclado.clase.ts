import axios from 'axios';
import { menusInstance } from '../menus/menus.clase';
import { articulosInstance } from '../articulos/articulos.clase';
import { parametrosInstance } from '../parametros/parametros.clase';
import { ofertas } from '../promociones/promociones.clase';
import * as schTeclas from './teclado.mongodb';

export class TecladoClase {
    insertarTeclas(arrayTeclas) {
        return schTeclas.insertarTeclas(arrayTeclas).then((res) => {
            return res.acknowledged;
        }).catch((err) => {
            console.log(err);
            return false;
        });
    }

    actualizarTeclado() {
        return axios.post('articulos/descargarArticulosEspeciales', { database: parametrosInstance.getParametros().database, codigoCliente: parametrosInstance.getParametros().codigoTienda }).then((res: any) => {
            if (res.data.error == false) {
                return axios.post('menus/getMenus', { database: parametrosInstance.getParametros().database, codigoTienda: parametrosInstance.getParametros().codigoTienda }).then((resMenusSanPedro: any) => {
                    return menusInstance.insertarMenus(resMenusSanPedro.data.info).then((resMenus) => {
                        if (resMenus) {
                            return articulosInstance.insertarArticulos(res.data.info).then((res2) => {
                                if (res2) {
                                    return axios.post('/teclas/descargarTeclados', { database: parametrosInstance.getParametros().database, licencia: parametrosInstance.getParametros().codigoTienda }).then((infoTeclados: any) => {
                                        if (infoTeclados.data.error == false) {
                                            return tecladoInstance.insertarTeclas(infoTeclados.data.info).then((resultado) => {
                                                if (resultado) {
                                                    // return { error: false, mensaje: '' };
                                                    return axios.post('promociones/getPromociones', { database: parametrosInstance.getParametros().database, codigoTienda: parametrosInstance.getParametros().codigoTienda }).then((resPromociones: any) => {
                                                        if (resPromociones.data.error == false) {
                                                            return ofertas.insertarPromociones(resPromociones.data.info).then((resInsertPromos) => {
                                                                if (resInsertPromos) {
                                                                    return { error: false };
                                                                } else {
                                                                    return { error: true, mensaje: 'Backend: Error teclado/actualizarTeclado 5' }
                                                                }
                                                            }).catch((err) => {
                                                                console.log(err);
                                                                return { error: true, mensaje: 'Backend: Error teclado/actualizarTeclado 4 CATCH' }
                                                            });
                                                        } else {
                                                            return { error: true, mensaje: resPromociones.data.mensaje };
                                                        }
                                                    }).catch((err) => {
                                                        console.log(err);
                                                        return { error: true, mensaje: 'Backend: Error teclado/actualizarTeclado 3' }
                                                    })
                                                } else {
                                                    return { error: true, mensaje: 'Backend: Error teclado/actualizarTeclado 2' };
                                                }
                                            }).catch((err) => {
                                                console.log(err);
                                                return { error: true, mensaje: 'Backend: Error teclado/actualizarTeclado try catch' };
                                            });
                                        } else {
                                            return { error: true, mensaje: infoTeclados.data.mensaje };
                                        }
                                    }).catch((err: any) => {
                                        console.log(err);
                                        return { error: true, mensaje: 'Backend: teclado/actualizarTeclado error en segundo post catch' };
                                    });
                                } else {
                                    return { error: true, mensaje: 'Error backend en actualizarTeclado/insertarArticulos' };
                                }
                            }).catch((err) => {
                                console.log(err);
                                return { error: true, mensaje: 'Error backend en actualizarTeclado/insertarArticulos CATCH' };
                            });
                        } else {
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



            } else {
                return { error: true, mensaje: res.data.mensaje };
            }
        }).catch((err) => {
            console.log(err);
            return {
                error: true,
                mensaje: 'Backend: Error en catch actualizarArticulos'
            }
        });
    }

    async cambiarPosTecla(idArticle, nuevaPos, nombreMenu) {
        return await schTeclas.cambiarPosTecla(idArticle, nuevaPos, nombreMenu);
    }
}
export const tecladoInstance = new TecladoClase();