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
exports.TrabajadoresController = void 0;
const common_1 = require("@nestjs/common");
const trabajadores_clase_1 = require("./trabajadores.clase");
const utiles_module_1 = require("../utiles/utiles.module");
const parametros_clase_1 = require("../parametros/parametros.clase");
const axios_1 = require("axios");
let TrabajadoresController = class TrabajadoresController {
    getTrabajadoresFichados() {
        return trabajadores_clase_1.trabajadoresInstance.getTrabajadoresFichados().then((res) => {
            if (res.length > 0) {
                return {
                    error: false,
                    res: res
                };
            }
            else {
                return {
                    error: false,
                    res: []
                };
            }
        }).catch((err) => {
            console.log(err);
            return {
                error: true
            };
        });
    }
    setTrabajadorActivo(params) {
        if (params.id) {
            return trabajadores_clase_1.trabajadoresInstance.setCurrentTrabajadorPorNombre(params.id).then((res) => {
                if (res) {
                    return {
                        error: false,
                    };
                }
                else {
                    return { error: true };
                }
            }).catch((err) => {
                console.log(err);
                return { error: true };
            });
        }
    }
    getCurrentTrabajador() {
        return trabajadores_clase_1.trabajadoresInstance.getCurrentTrabajador().then((res) => {
            if (res != null) {
                return { error: false, trabajador: res };
            }
            else {
                return { error: true };
            }
        }).catch((err) => {
            console.log(err);
            return { error: true };
        });
    }
    getCurrentTrabajadorr() {
        return trabajadores_clase_1.trabajadoresInstance.getCurrentTrabajador().then((res) => {
            if (res != null) {
                return { error: false, trabajador: res };
            }
            else {
                return { error: true };
            }
        }).catch((err) => {
            console.log(err);
            return { error: true };
        });
    }
    buscar(params) {
        return trabajadores_clase_1.trabajadoresInstance.buscar(params.busqueda);
    }
    fichar(params) {
        if (params.idTrabajador != undefined && params.idPlan != undefined && params.idPlan != null) {
            return trabajadores_clase_1.trabajadoresInstance.ficharTrabajador(params.idTrabajador, params.idPlan).then((res) => {
                if (res) {
                    return { error: false };
                }
                else {
                    return { error: true, mensaje: 'Error en ficharTrabajador()' };
                }
            }).catch((err) => {
                console.log(err);
                return { error: true, mensaje: 'Error, mirar consola nest' };
            });
        }
        else {
            return { error: true, mensaje: 'Backend: Faltan datos en trabajadores/fichar' };
        }
    }
    desfichar(params) {
        return trabajadores_clase_1.trabajadoresInstance.desficharTrabajador(params.idTrabajador).then((res) => {
            if (res) {
                return { error: false };
            }
            else {
                return { error: true, mensaje: 'Error en desficharTrabajador()' };
            }
        }).catch((err) => {
            console.log(err);
            return { error: true, mensaje: 'Error, mirar consola nest' };
        });
    }
    actualizarTrabajadores() {
        return trabajadores_clase_1.trabajadoresInstance.actualizarTrabajadores().then((res) => {
            console.log(res);
            return res;
        }).catch((err) => {
            console.log(err);
            return { error: true, mensaje: 'Backend: Error en trabajadores/actualizarTrabajadores CATCH' };
        });
    }
    crearPlan(params) {
        if (utiles_module_1.UtilesModule.checkVariable(params.horaEntrada, params.horaSalida)) {
            const parametros = parametros_clase_1.parametrosInstance.getParametros();
            return axios_1.default.post('dependientas/crearPlan', {
                parametros,
                horaEntrada: params.horaEntrada,
                horaSalida: params.horaSalida
            }).then((res) => {
                if (res.data.error == false) {
                    return { error: false };
                }
                else {
                    return { error: true, mensaje: res.data.mensaje };
                }
            }).catch((err) => {
                console.log(err);
                return { error: true, mensaje: 'Error en backend crearPlan CATCH' };
            });
        }
        else {
            return { error: true, mensaje: 'Error, faltan datos trabajadores/crearPlan' };
        }
    }
    getTrabajaronAyer() {
        return trabajadores_clase_1.trabajadoresInstance.getTrabajaronAyer();
    }
    guardarHorasExtraCoordinacion(params) {
        if (utiles_module_1.UtilesModule.checkVariable(params.horasExtra, params.horasCoordinacion, params.idTrabajador, params.timestamp)) {
            return trabajadores_clase_1.trabajadoresInstance.guardarHorasExtraCoordinacion(params.horasExtra, params.horasCoordinacion, params.idTrabajador, params.timestamp).then((res) => {
                return res;
            }).catch((err) => {
                console.log(err);
            });
        }
        else {
            return { error: true, mensaje: 'Backend: Error faltan datos en trabajadores/guardarHorasExtrCoordinacion' };
        }
    }
};
__decorate([
    (0, common_1.Post)('getTrabajadoresFichados'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TrabajadoresController.prototype, "getTrabajadoresFichados", null);
__decorate([
    (0, common_1.Post)('setActivo'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TrabajadoresController.prototype, "setTrabajadorActivo", null);
__decorate([
    (0, common_1.Post)('getCurrentTrabajador'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TrabajadoresController.prototype, "getCurrentTrabajador", null);
__decorate([
    (0, common_1.Get)('getCurrentTrabajadorNueva'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TrabajadoresController.prototype, "getCurrentTrabajadorr", null);
__decorate([
    (0, common_1.Post)('buscar'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TrabajadoresController.prototype, "buscar", null);
__decorate([
    (0, common_1.Post)('fichar'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TrabajadoresController.prototype, "fichar", null);
__decorate([
    (0, common_1.Post)('desfichar'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TrabajadoresController.prototype, "desfichar", null);
__decorate([
    (0, common_1.Post)('actualizarTrabajadores'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TrabajadoresController.prototype, "actualizarTrabajadores", null);
__decorate([
    (0, common_1.Post)('crearPlan'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TrabajadoresController.prototype, "crearPlan", null);
__decorate([
    (0, common_1.Get)('getTrabajaronAyer'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TrabajadoresController.prototype, "getTrabajaronAyer", null);
__decorate([
    (0, common_1.Post)('guardarHorasExtraCoordinacion'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TrabajadoresController.prototype, "guardarHorasExtraCoordinacion", null);
TrabajadoresController = __decorate([
    (0, common_1.Controller)('trabajadores')
], TrabajadoresController);
exports.TrabajadoresController = TrabajadoresController;
//# sourceMappingURL=trabajadores.controller.js.map