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
exports.ClientesController = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const utiles_module_1 = require("../utiles/utiles.module");
const articulos_clase_1 = require("../articulos/articulos.clase");
const parametros_clase_1 = require("../parametros/parametros.clase");
const clientes_clase_1 = require("./clientes.clase");
let ClientesController = class ClientesController {
    buscarCliente(params) {
        return clientes_clase_1.clienteInstance.buscar(params.busqueda);
    }
    getClienteByID(params) {
        console.log(params);
        if (params.idCliente != undefined) {
            return clientes_clase_1.clienteInstance.getClienteByID(params.idCliente).then((res) => {
                if (res != null) {
                    return { error: false, infoCliente: res };
                }
                else {
                    return { error: true, mensaje: 'Error. Este cliente no existe en la BBDD' };
                }
            }).catch((err) => {
                console.log(err);
                return { error: true, mensaje: 'Error en getClienteByID' };
            });
        }
        else {
            return { error: true, mensaje: 'Error, faltan datos' };
        }
        return clientes_clase_1.clienteInstance.buscar(params.busqueda);
    }
    comprobarVIP(params) {
        const parametros = parametros_clase_1.parametrosInstance.getParametros();
        return axios_1.default.post('clientes/comprobarVIP', { database: parametros.database, idClienteFinal: params.idClienteFinal }).then((res) => {
            if (res.data.error === false) {
                if (res.data.articulosEspeciales != undefined) {
                    articulos_clase_1.articulosInstance.setEstadoTarifaEspecial(true);
                    clientes_clase_1.clienteInstance.setEstadoClienteVIP(true);
                    return articulos_clase_1.articulosInstance.insertarArticulos(res.data.articulosEspeciales, true).then((resInsertArtEspecial) => {
                        if (resInsertArtEspecial) {
                            return { error: false, info: res.data.info };
                        }
                        return { error: true, mensaje: 'Backend: Error en clientes/comprobarVIP > InsertarArticulos especiales' };
                    }).catch((err) => {
                        console.log(err);
                        return { error: true, mensaje: 'Backend: Error en catch clientes/comprobarVIP > InsertarArticulos (especiales)' };
                    });
                }
                else {
                    return { error: false, info: res.data.info };
                }
            }
            else {
                return { error: true, mensaje: res.data.mensaje };
            }
        }).catch((err) => {
            console.log(err);
            return { error: true, mensaje: 'Error en backend comprobarVIP' };
        });
    }
    descargarClientesFinales() {
        const parametros = parametros_clase_1.parametrosInstance.getParametros();
        return axios_1.default.post('clientes/getClientesFinales', { database: parametros.database }).then((res) => {
            if (res.data.error == false) {
                return clientes_clase_1.clienteInstance.insertarClientes(res.data.info).then((operacionResult) => {
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
    crearNuevoCliente(params) {
        if (utiles_module_1.UtilesModule.checkVariable(params.idTarjetaCliente, params.nombreCliente)) {
            if (params.idTarjetaCliente.toString().length > 5 && params.nombreCliente.length >= 3) {
                const parametros = parametros_clase_1.parametrosInstance.getParametros();
                return axios_1.default.post('clientes/crearNuevoCliente', {
                    idTarjetaCliente: params.idTarjetaCliente,
                    nombreCliente: params.nombreCliente,
                    idCliente: `CliBoti_${parametros.codigoTienda}_${Date.now()}`,
                    parametros: parametros
                }).then((res) => {
                    if (res.data.error == false) {
                        return { error: false };
                    }
                    else {
                        return { error: true, mensaje: res.data.mensaje };
                    }
                }).catch((err) => {
                    console.log(err);
                    return { error: true, mensaje: 'Error backend: clientes/crearNuevoCliente CATCH' };
                });
            }
            else {
                return { error: true, mensaje: 'Error, nombre o número de tarjeta incorrectos' };
            }
        }
        else {
            return { error: true, mensaje: 'Error Backend: Faltan datos en clientes/crearNuevoCliente' };
        }
    }
};
__decorate([
    (0, common_1.Post)('buscar'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ClientesController.prototype, "buscarCliente", null);
__decorate([
    (0, common_1.Post)('getClienteByID'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ClientesController.prototype, "getClienteByID", null);
__decorate([
    (0, common_1.Post)('comprobarVIP'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ClientesController.prototype, "comprobarVIP", null);
__decorate([
    (0, common_1.Post)('descargarClientesFinales'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ClientesController.prototype, "descargarClientesFinales", null);
__decorate([
    (0, common_1.Post)('crearNuevoCliente'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ClientesController.prototype, "crearNuevoCliente", null);
ClientesController = __decorate([
    (0, common_1.Controller)('clientes')
], ClientesController);
exports.ClientesController = ClientesController;
//# sourceMappingURL=clientes.controller.js.map