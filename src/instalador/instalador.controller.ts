import { Controller, Post, Body } from '@nestjs/common';
import axios from 'axios';
import { ParametrosInterface } from '../parametros/parametros.interface';
import { parametrosInstance } from '../parametros/parametros.clase';
import { trabajadoresInstance } from 'src/trabajadores/trabajadores.clase';
import { articulosInstance } from 'src/articulos/articulos.clase';
import { clienteInstance } from 'src/clientes/clientes.clase';
import { familiasInstance } from 'src/familias/familias.class';
import { ofertas } from 'src/promociones/promociones.clase';
import { paramsTicketInstance } from 'src/params-ticket/params-ticket.class';
import { menusInstance } from 'src/menus/menus.clase';
import { tecladoInstance } from 'src/teclado/teclado.clase';
import { dobleMenusInstance } from 'src/doble-menus/doble-menus.clase';

@Controller('instalador')
export class InstaladorController {
    @Post('pedirDatos')
    instalador(@Body() params) {
        return axios.post('parametros/instaladorLicencia', {
            password: params.password,
            numLlicencia: params.numLlicencia
        }).then((res: any) => {
            if (!res.data.error) {
                const objParams: ParametrosInterface = {
                    _id: 'PARAMETROS',
                    licencia: params.numLlicencia,
                    tipoImpresora: params.tipoImpresora,
                    tipoDatafono: params.tipoDatafono,
                    impresoraCafeteria: params.impresoraCafeteria,
                    ultimoTicket: res.data.info.ultimoTicket,
                    codigoTienda: res.data.info.codigoTienda,
                    nombreEmpresa: res.data.info.nombreEmpresa,
                    nombreTienda: res.data.info.nombreTienda,
                    prohibirBuscarArticulos: res.data.info.prohibirBuscarArticulos,
                    token: res.data.info.token,
                    database: res.data.info.database,
                    botonesConPrecios: res.data.info.botonesConPrecios,
                    impresoraUsbInfo: { pid: '', vid: '' },
                    idCurrentTrabajador: null
                };
                return parametrosInstance.setParametros(objParams).then((res2) => {
                    if (res2) {
                        return { error: false };
                    } else {
                        return { error: true, mensaje: 'Backend: Error en instalador/pedirDatos > setParametros'};
                    }
                }).catch((err) => {
                    console.log(err);
                    return  { error: true, mensaje: 'Backend: No se ha podido setear parametros' };
                });
            } else {
                return { error: true, mensaje: res.data.mensaje };
            }
        }).catch((err) => {
            console.log(err);
            return { error: true, mensaje: 'Error en pedir parametros/instaladorLicencia de sanPedro' };
        });
    }

    @Post('descargarTodo')
    async descargarTodo() {
        const parametros = parametrosInstance.getParametros();
        return axios.post('datos/cargarTodo', {
            database: parametros.database,
            codigoTienda: parametros.codigoTienda,
            licencia: parametros.licencia
        }).then(async (res: any) => {
            if (res.data.error === false) {
                
                const info1 = await trabajadoresInstance.insertarTrabajadores(res.data.info.dependientas);
                const info2 = await articulosInstance.insertarArticulos(res.data.info.articulos);
                const info3 = await clienteInstance.insertarClientes(res.data.info.clientes);
                const info4 = await familiasInstance.insertarFamilias(res.data.info.familias);
                const info5 = await ofertas.insertarPromociones(res.data.info.promociones);
                const info6 = await paramsTicketInstance.insertarParametrosTicket(res.data.info.parametrosTicket);
                const info7 = await menusInstance.insertarMenus(res.data.info.menus);
                const info8 = await tecladoInstance.insertarTeclas(res.data.info.teclas);
                // const info9 = await cestas.insertarCestas(res.data.info.cestas);
                const info10 = await dobleMenusInstance.insertarMenus(res.data.info.dobleMenus);

                if (info1 && info2 && info3 && info4 && info5 && info6 && info7 && info8 && info10) {
                    return { error: false };
                } else {
                    return { error: true, mensaje: `Backend: res1: ${info1}, res2: ${info2}, res3: ${info3}, res4: ${info4}, res5: ${info5}, res6: ${info6}, res7: ${info7}, res8: ${info8}`};
                }
            } else {
                return { error: true, mensaje: res.data.mensaje };
            }
        }).catch((err) => {
            console.log(err);
            return { error: true, mensaje: 'Backend: Errro en instalador/descargarTodo. Mirar log'};
        });
    }
}
