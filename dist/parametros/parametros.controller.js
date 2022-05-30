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
exports.ParametrosController = void 0;
const common_1 = require("@nestjs/common");
const parametros_clase_1 = require("./parametros.clase");
let ParametrosController = class ParametrosController {
    todoInstalado() {
        const res = parametros_clase_1.parametrosInstance.todoInstalado();
        if (res) {
            const respuestaParametros = parametros_clase_1.parametrosInstance.getParametros();
            return {
                todoInstalado: res,
                config: respuestaParametros
            };
        }
        else {
            return { todoInstalado: false };
        }
    }
    getParametros() {
        const parametros = parametros_clase_1.parametrosInstance.getParametros();
        return { error: false, parametros };
    }
    getParametrosBonito() {
        const parametros = parametros_clase_1.parametrosInstance.getParametros();
        return { error: false, parametros };
    }
    vidAndPid(params) {
        if (params != undefined || params != null) {
            if (params.vid != undefined || params.vid != null || params.pid != undefined || params.pid != null) {
                return parametros_clase_1.parametrosInstance.setVidAndPid(params.vid, params.pid).then((res) => {
                    if (res) {
                        return { error: false };
                    }
                    else {
                        return { error: true, mensaje: 'Backend: parametros/vidAndPid setVidAndPid no se ha podido guardar' };
                    }
                }).catch((err) => {
                    console.log(err);
                    return { error: true, mensaje: 'Backend: parametros/vidAndPid setVidAndPid catch' };
                });
            }
            else {
                return { error: true, mensaje: 'Backend: parametros/vidAndPid faltan datos' };
            }
        }
        else {
            return { error: true, mensaje: 'Backend: parametros/vidAndPid faltan todos los datos' };
        }
    }
    getVidAndPid() {
        return parametros_clase_1.parametrosInstance.getEspecialParametros().then((res) => {
            if (res.impresoraUsbInfo != undefined || res.impresoraUsbInfo != null) {
                return { error: false, info: res };
            }
            else {
                return { error: false, info: {
                        impresoraUsbInfo: {
                            vid: '',
                            pid: ''
                        }
                    } };
            }
        }).catch((err) => {
            console.log(err);
            return { error: true, mensaje: 'Backend: Error en getVidAndPid CATCH' };
        });
    }
    setIpPaytef(params) {
        if (params != undefined || params != null) {
            if (params.ip != undefined || params.ip != null) {
                return parametros_clase_1.parametrosInstance.setIpPaytef(params.ip).then((res) => {
                    if (res) {
                        return { error: false };
                    }
                    else {
                        return { error: true, mensaje: 'Backend: parametros/setIpPaytef setIpPaytef no se ha podido guardar' };
                    }
                }).catch((err) => {
                    console.log(err);
                    return { error: true, mensaje: 'Backend: parametros/setIpPaytef setIpPaytef catch' };
                });
            }
            else {
                return { error: true, mensaje: 'Backend: parametros/setIpPaytef faltan datos' };
            }
        }
        else {
            return { error: true, mensaje: 'Backend: parametros/setIpPaytef faltan todos los datos' };
        }
    }
    getIpPaytef() {
        return parametros_clase_1.parametrosInstance.getEspecialParametros().then((res) => {
            if (res.ipTefpay != undefined || res.ipTefpay != null) {
                return { error: false, info: res.ipTefpay };
            }
            else {
                return { error: false, info: '' };
            }
        }).catch((err) => {
            console.log(err);
            return { error: true, mensaje: 'Backend: Error en getIpPaytef CATCH' };
        });
    }
};
__decorate([
    (0, common_1.Post)('todoInstalado'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ParametrosController.prototype, "todoInstalado", null);
__decorate([
    (0, common_1.Post)('getParametros'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ParametrosController.prototype, "getParametros", null);
__decorate([
    (0, common_1.Get)('getParametrosBonito'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ParametrosController.prototype, "getParametrosBonito", null);
__decorate([
    (0, common_1.Post)('vidAndPid'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ParametrosController.prototype, "vidAndPid", null);
__decorate([
    (0, common_1.Get)('getVidAndPid'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ParametrosController.prototype, "getVidAndPid", null);
__decorate([
    (0, common_1.Post)('setIpPaytef'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ParametrosController.prototype, "setIpPaytef", null);
__decorate([
    (0, common_1.Get)('getIpPaytef'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ParametrosController.prototype, "getIpPaytef", null);
ParametrosController = __decorate([
    (0, common_1.Controller)('parametros')
], ParametrosController);
exports.ParametrosController = ParametrosController;
//# sourceMappingURL=parametros.controller.js.map