import { Controller, Post, Body } from '@nestjs/common';
import axios from 'axios';
import { UtilesModule } from 'src/utiles/utiles.module';
import { articulosInstance } from '../articulos/articulos.clase';
import { parametrosInstance } from '../parametros/parametros.clase';
import { clienteInstance } from './clientes.clase';

@Controller('clientes')
export class ClientesController {
    @Post('buscar')
    buscarCliente(@Body() params) {
        return clienteInstance.buscar(params.busqueda);
    }

    @Post('getClienteByID')
    getClienteByID(@Body() params) {
        console.log(params);
        if (params.idCliente != undefined) {
            return clienteInstance.getClienteByID(params.idCliente).then((res) => {
                if (res != null) {
                    return {error: false, infoCliente: res}
                } else {
                    return { error: true, mensaje: 'Error. Este cliente no existe en la BBDD' };
                }
            }).catch((err) => {
                console.log(err);
                return { error: true, mensaje: 'Error en getClienteByID'};
            });
        } else {
            return { error: true, mensaje: 'Error, faltan datos' };
        }
        return clienteInstance.buscar(params.busqueda);
    }

    @Post('comprobarVIP')
    comprobarVIP(@Body() params) {
        const parametros = parametrosInstance.getParametros();
        return axios.post('clientes/comprobarVIP', { database: parametros.database, idClienteFinal: params.idClienteFinal }).then((res: any) => {
            if (res.data.error === false) { // No hay error
                if (res.data.articulosEspeciales != undefined) { // Tiene tarifa especial
                    /* Añadir articulosTarifaEspecial a Mongo */
                    articulosInstance.setEstadoTarifaEspecial(true);
                    clienteInstance.setEstadoClienteVIP(true);
                    return articulosInstance.insertarArticulos(res.data.articulosEspeciales, true).then((resInsertArtEspecial) => {
                        if (resInsertArtEspecial) {
                            return { error: false, info: res.data.info };
                        }
                        return { error: true, mensaje: 'Backend: Error en clientes/comprobarVIP > InsertarArticulos especiales' };
                    }).catch((err) => {
                        console.log(err);
                        return { error: true, mensaje: 'Backend: Error en catch clientes/comprobarVIP > InsertarArticulos (especiales)' };
                    });
                } else { // No tiene tarifa especial
                    // console.log('Puntos: ', res.data.info.puntos);
                    return { error: false, info: res.data.info };
                }
            } else {
                return { error: true, mensaje: res.data.mensaje };
            }
        }).catch((err) => {
            console.log(err);
            return { error: true, mensaje: 'Error en backend comprobarVIP'};
        });
    }

    @Post('descargarClientesFinales')
    descargarClientesFinales() {
        const parametros = parametrosInstance.getParametros();
        return axios.post('clientes/getClientesFinales', { database: parametros.database }).then((res: any) => {
            if (res.data.error == false) {
                return clienteInstance.insertarClientes(res.data.info).then((operacionResult) => {
                    if (operacionResult) {
                        return { error: false };
                    }
                    return { error: true, mensaje: 'Backend: Error en insertarClientes de clientes/descargarClientesFinales' };
                }).catch((err) => {
                    console.log(err);
                    return { error: true, mensaje: 'Backend: Error en insertarClientes de clientes/descargarClientesFinales CATCH' };
                });
            }
            return { error: true, mensaje: res.data.mensaje };
        }).catch((err) => {
            console.log(err);
            return { error: true, mensaje: 'Backend: Error en clientes/descargarClientesFinales CATCH' };
        });
    }

    @Post('crearNuevoCliente')
    crearNuevoCliente(@Body() params) {
        if (UtilesModule.checkVariable(params.idTarjetaCliente, params.nombreCliente)) {
            if (params.idTarjetaCliente.toString().length > 5 && params.nombreCliente.length >= 3) {
                const parametros = parametrosInstance.getParametros();
                return axios.post('clientes/crearNuevoCliente', {
                    idTarjetaCliente: params.idTarjetaCliente,
                    nombreCliente: params.nombreCliente,
                    idCliente: `CliBoti_${parametros.codigoTienda}_${Date.now()}`,
                    parametros: parametros
                }).then((res: any) => {
                    if (res.data.error == false) {
                        return { error: false };
                    } else {
                        return { error: true, mensaje: res.data.mensaje };
                    }
                }).catch((err) => {
                    console.log(err);
                    return { error: true, mensaje: 'Error backend: clientes/crearNuevoCliente CATCH' }
                });
            } else {
                return { error: true, mensaje: 'Error, nombre o número de tarjeta incorrectos' };
            }
        } else {
            return { error: true, mensaje: 'Error Backend: Faltan datos en clientes/crearNuevoCliente' };
        }
    }
}
