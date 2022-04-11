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
exports.CestasController = void 0;
const common_1 = require("@nestjs/common");
const utiles_module_1 = require("../utiles/utiles.module");
const trabajadores_clase_1 = require("../trabajadores/trabajadores.clase");
const cestas_clase_1 = require("./cestas.clase");
let CestasController = class CestasController {
    borrarCesta(params) {
        return cestas_clase_1.cestas.borrarCesta(params.id).then((res) => {
            if (res) {
                return cestas_clase_1.cestas.getTodasCestas().then((listaCestas) => {
                    if (listaCestas.length > 0) {
                        return {
                            okey: true,
                            cestaNueva: listaCestas[0],
                        };
                    }
                    else {
                        const nueva = cestas_clase_1.cestas.nuevaCestaVacia();
                        return cestas_clase_1.cestas.setCesta(nueva).then((resultado) => {
                            if (resultado) {
                                return {
                                    okey: true,
                                    cestaNueva: nueva,
                                };
                            }
                            else {
                                return {
                                    okey: false,
                                    error: "Error en crear nueva cesta"
                                };
                            }
                        });
                    }
                }).catch((err) => {
                    return {
                        okey: false,
                        error: "Error en getTodasCestas"
                    };
                });
            }
            else {
                return {
                    okey: false,
                    error: "Error borrando cesta"
                };
            }
        }).catch((err) => {
            return {
                okey: false,
                error: "Error en borrarCesta"
            };
        });
    }
    borrarItemCesta(params) {
        return cestas_clase_1.cestas.borrarItemCesta(params._id, params.idArticulo).then((res) => {
            return {
                okey: true,
                cestaNueva: res
            };
        }).catch((err) => {
            return {
                okey: false,
                error: "Error en borrarItemCesta"
            };
        });
    }
    borrarArticulosCesta(params) {
        if (params.idCesta != undefined && params.idCesta != null) {
            return cestas_clase_1.cestas.borrarArticulosCesta(params.idCesta).then((res) => {
                if (res) {
                    return { error: false, info: res };
                }
                return { error: true, mensaje: 'Backend: Error en cestas/borrarArticulosCesta >' };
            });
        }
        else {
            return { error: true, mensaje: 'Backend: Error cestas/borrarArticulosCesta faltan datos' };
        }
    }
    getCesta() {
        return cestas_clase_1.cestas.getCestaRandom().then((res) => {
            return res;
        }).catch((err) => {
            return {
                okey: false,
                error: "Error en borrarItemCesta"
            };
        });
    }
    getCestaDiferent(params) {
        if (params.id_cesta) {
            return cestas_clase_1.cestas.getCestaDiferente(params.id_cesta).then((res) => {
                return res;
            }).catch((err) => {
                return {
                    okey: false,
                    error: "Error en borrarItemCesta"
                };
            });
        }
    }
    getCestaByID(params) {
        return trabajadores_clase_1.trabajadoresInstance.getCurrentTrabajador().then((res) => {
            return cestas_clase_1.cestas.getCesta(res._id).then((res) => {
                if (res) {
                    return { error: false, info: res };
                }
                return { error: true, mensaje: 'Backend: Error en cestas/getCestaByID' };
            }).catch((err) => {
                console.log(err);
                return { error: true, mensaje: 'Backend: Error en cestas/getCestaByID CATCH' };
            });
        });
    }
    getCestaCurrentTrabajador() {
        return trabajadores_clase_1.trabajadoresInstance.getCurrentTrabajador().then((res) => {
            if (res != null) {
                return cestas_clase_1.cestas.getCestaByTrabajadorID(res._id).then((res) => {
                    if (res) {
                        return { error: false, info: res };
                    }
                    return { error: true, mensaje: 'Backend: Error en cestas/getCestaByID' };
                }).catch((err) => {
                    console.log(err);
                    return { error: true, mensaje: 'Backend: Error en cestas/getCestaByID CATCH' };
                });
            }
            else {
                return { error: true, mensaje: 'Backend: Error, no hay ningún trabajador activo' };
            }
        });
    }
    crearCesta(params) {
        if (params.nombreCesta != undefined && params.nombreCesta != null) {
            return cestas_clase_1.cestas.crearNuevaCesta(params.nombreCesta).then((res) => {
                if (res) {
                    return { error: false, info: res };
                }
                else {
                    return { error: true, mensaje: 'Backend: Error en cestas/crearCesta. No se ha podido crear la nueva cesta' };
                }
            });
        }
        else {
            return { error: true, mensaje: 'Backend: Error en cestas/crearCesta FALTAN DATOS' };
        }
    }
    getCestas() {
        return cestas_clase_1.cestas.getTodasCestas().then((res) => {
            return { error: false, info: res };
        }).catch((err) => {
            console.log(err);
            return { error: true, mensaje: 'Backend: Error en cestas/getCestas CATCH' };
        });
    }
    setUnidadesAplicar(params) {
        cestas_clase_1.cestas.setUnidadesAplicar(params.unidades);
        return { okey: true };
    }
    clickTeclaArticulo(params) {
        return cestas_clase_1.cestas.addItem(params.idArticulo, params.idBoton, params.peso, params.infoAPeso, params.idCesta, params.unidades).then((res) => {
            return {
                error: false,
                bloqueado: false,
                cesta: res
            };
        }).catch((err) => {
            return {
                error: true,
                bloqueado: false
            };
        });
    }
    regalarProducto(params) {
        if (params.idCesta != undefined && params.index != undefined) {
            return cestas_clase_1.cestas.getCesta(params.idCesta).then((cesta) => {
                if (cesta != null) {
                    cesta.lista[params.index].subtotal = 0;
                    cesta['regalo'] = true;
                    return cestas_clase_1.cestas.setCesta(cesta).then((res) => {
                        if (res) {
                            return { error: false, cesta: cesta };
                        }
                        return { error: true, mensaje: 'Backend: Error en cestas/regalarProductos > setCesta' };
                    }).catch((err) => {
                        console.log(err);
                        return { error: true, mensaje: 'Backend: Error en cestas/regalarProductos > setCesta CATCH' };
                    });
                }
                else {
                    return { error: true, mensaje: 'Backend: Error, cesta vacía' };
                }
            }).catch((err) => {
                console.log(err);
                return { error: true, mensaje: 'Backend: Error en cestas/regalarProducto > getCesta CATCH' };
            });
        }
        else {
            return { error: true, mensaje: 'Backend: Error: faltan datos en cestas/regalarProducto' };
        }
    }
    addSuplemento(params) {
        if (params.idCesta && params.suplementos && params.idArticulo) {
            return cestas_clase_1.cestas.addSuplemento(params.idCesta, params.suplementos, params.idArticulo, params.posArticulo).then((res) => {
                return {
                    error: false,
                    bloqueado: false,
                    cesta: res
                };
            }).catch((err) => {
                console.log(err);
                return {
                    error: true,
                    bloqueado: false
                };
            });
        }
    }
    modificarSuplementos(params) {
        if (params.cestaId && params.idArticulo) {
            return cestas_clase_1.cestas.modificarSuplementos(params.cestaId, params.idArticulo, params.posArticulo).then((res) => {
                if (res.suplementos) {
                    return {
                        suplementos: true,
                        suplementosData: res.suplementosData,
                        suplementosSeleccionados: res.suplementosSeleccionados,
                    };
                }
                return { suplementos: false };
            });
        }
    }
    enviarACocina(params) {
        if (params.idCesta) {
            return cestas_clase_1.cestas.enviarACocina(params.idCesta).then((res) => {
                return res;
            });
        }
    }
    async getCestaByTrabajadorId(params) {
        if (utiles_module_1.UtilesModule.checkVariable(params.idTrabajador)) {
            return { error: false, info: await cestas_clase_1.cestas.getCestaByTrabajadorID(params.idTrabajador) };
        }
        else {
            return { error: true, mensaje: 'Backend error, faltan datos en cestas/getCestaByTrabajadorId' };
        }
    }
};
__decorate([
    (0, common_1.Post)('borrarCesta'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CestasController.prototype, "borrarCesta", null);
__decorate([
    (0, common_1.Post)('borrarItemCesta'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CestasController.prototype, "borrarItemCesta", null);
__decorate([
    (0, common_1.Post)('borrarArticulosCesta'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CestasController.prototype, "borrarArticulosCesta", null);
__decorate([
    (0, common_1.Post)('getCesta'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CestasController.prototype, "getCesta", null);
__decorate([
    (0, common_1.Post)('getCestaDiferente'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CestasController.prototype, "getCestaDiferent", null);
__decorate([
    (0, common_1.Post)('getCestaByID'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CestasController.prototype, "getCestaByID", null);
__decorate([
    (0, common_1.Get)('getCestaCurrentTrabajador'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CestasController.prototype, "getCestaCurrentTrabajador", null);
__decorate([
    (0, common_1.Post)('crearCesta'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CestasController.prototype, "crearCesta", null);
__decorate([
    (0, common_1.Get)('getCestas'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CestasController.prototype, "getCestas", null);
__decorate([
    (0, common_1.Post)('setUnidadesAplicar'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CestasController.prototype, "setUnidadesAplicar", null);
__decorate([
    (0, common_1.Post)('clickTeclaArticulo'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CestasController.prototype, "clickTeclaArticulo", null);
__decorate([
    (0, common_1.Post)('regalarProducto'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CestasController.prototype, "regalarProducto", null);
__decorate([
    (0, common_1.Post)('addSuplemento'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CestasController.prototype, "addSuplemento", null);
__decorate([
    (0, common_1.Post)('modificarSuplementos'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CestasController.prototype, "modificarSuplementos", null);
__decorate([
    (0, common_1.Post)('enviarACocina'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CestasController.prototype, "enviarACocina", null);
__decorate([
    (0, common_1.Post)('getCestaByTrabajadorId'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CestasController.prototype, "getCestaByTrabajadorId", null);
CestasController = __decorate([
    (0, common_1.Controller)('cestas')
], CestasController);
exports.CestasController = CestasController;
//# sourceMappingURL=cestas.controller.js.map