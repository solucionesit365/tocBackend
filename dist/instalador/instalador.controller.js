"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstaladorController = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const parametros_clase_1 = require("../parametros/parametros.clase");
const trabajadores_clase_1 = require("../trabajadores/trabajadores.clase");
const articulos_clase_1 = require("../articulos/articulos.clase");
const clientes_clase_1 = require("../clientes/clientes.clase");
const familias_class_1 = require("../familias/familias.class");
const promociones_clase_1 = require("../promociones/promociones.clase");
const params_ticket_class_1 = require("../params-ticket/params-ticket.class");
const menus_clase_1 = require("../menus/menus.clase");
const teclado_clase_1 = require("../teclado/teclado.clase");
const doble_menus_clase_1 = require("../doble-menus/doble-menus.clase");
let InstaladorController = class InstaladorController {
    instalador(params) {
        return axios_1.default.post('parametros/instaladorLicencia', {
            password: params.password,
            numLlicencia: params.numLlicencia
        }).then((res) => {
            if (!res.data.error) {
                const objParams = {
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
                return parametros_clase_1.parametrosInstance.setParametros(objParams).then((res2) => {
                    if (res2) {
                        return { error: false };
                    }
                    else {
                        return { error: true, mensaje: 'Backend: Error en instalador/pedirDatos > setParametros' };
                    }
                }).catch((err) => {
                    console.log(err);
                    return { error: true, mensaje: 'Backend: No se ha podido setear parametros' };
                });
            }
            else {
                return { error: true, mensaje: res.data.mensaje };
            }
        }).catch((err) => {
            console.log(err);
            return { error: true, mensaje: 'Error en pedir parametros/instaladorLicencia de sanPedro' };
        });
    }
    async descargarTodo() {
        const parametros = parametros_clase_1.parametrosInstance.getParametros();
        return axios_1.default.post('datos/cargarTodo', {
            database: parametros.database,
            codigoTienda: parametros.codigoTienda,
            licencia: parametros.licencia
        }).then(async (res) => {
            if (res.data.error === false) {
                const info1 = await trabajadores_clase_1.trabajadoresInstance.insertarTrabajadores(res.data.info.dependientas);
                const info2 = await articulos_clase_1.articulosInstance.insertarArticulos(res.data.info.articulos);
                const info3 = await clientes_clase_1.clienteInstance.insertarClientes(res.data.info.clientes);
                const info4 = await familias_class_1.familiasInstance.insertarFamilias(res.data.info.familias);
                const info5 = await promociones_clase_1.ofertas.insertarPromociones(res.data.info.promociones);
                const info6 = await params_ticket_class_1.paramsTicketInstance.insertarParametrosTicket(res.data.info.parametrosTicket);
                const info7 = await menus_clase_1.menusInstance.insertarMenus(res.data.info.menus);
                const info8 = await teclado_clase_1.tecladoInstance.insertarTeclas(res.data.info.teclas);
                const info10 = await doble_menus_clase_1.dobleMenusInstance.insertarMenus(res.data.info.dobleMenus);
                if (info1 && info2 && info3 && info4 && info5 && info6 && info7 && info8 && info10) {
                    return { error: false };
                }
                else {
                    return { error: true, mensaje: `Backend: res1: ${info1}, res2: ${info2}, res3: ${info3}, res4: ${info4}, res5: ${info5}, res6: ${info6}, res7: ${info7}, res8: ${info8}` };
                }
            }
            else {
                return { error: true, mensaje: res.data.mensaje };
            }
        }).catch((err) => {
            console.log(err);
            return { error: true, mensaje: 'Backend: Errro en instalador/descargarTodo. Mirar log' };
        });
    }
};
__decorate([
    (0, common_1.Post)('pedirDatos'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InstaladorController.prototype, "instalador", null);
__decorate([
    (0, common_1.Post)('descargarTodo'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InstaladorController.prototype, "descargarTodo", null);
InstaladorController = __decorate([
    (0, common_1.Controller)('instalador')
], InstaladorController);
exports.InstaladorController = InstaladorController;
//# sourceMappingURL=instalador.controller.js.map