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
exports.MovimientosController = void 0;
const common_1 = require("@nestjs/common");
const movimientos_clase_1 = require("./movimientos.clase");
let MovimientosController = class MovimientosController {
    nuevaSalida(params) {
        if (params.cantidad != undefined && params.concepto != undefined) {
            return movimientos_clase_1.movimientosInstance.nuevaSalida(params.cantidad, params.concepto, 'SALIDA').then((res) => {
                if (res) {
                    return { error: false };
                }
                else {
                    return { error: true, mensaje: 'Error en nuevaSalida()' };
                }
            }).catch((err) => {
                console.log(err);
                return { error: true, mensaje: 'Error, ver log nest' };
            });
        }
        else {
            return { error: true, mensaje: 'Error, faltan datos' };
        }
    }
    nuevaEntrada(params) {
        if (params.cantidad != undefined && params.concepto != undefined) {
            return movimientos_clase_1.movimientosInstance.nuevaEntrada(params.cantidad, params.concepto).then((res) => {
                if (res) {
                    return { error: false };
                }
                else {
                    return { error: true, mensaje: 'Error en nuevaEntrada()' };
                }
            }).catch((err) => {
                console.log(err);
                return { error: true, mensaje: 'Error, ver log nest' };
            });
        }
        else {
            return { error: true, mensaje: 'Error, faltan datos' };
        }
    }
};
__decorate([
    (0, common_1.Post)('nuevaSalida'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MovimientosController.prototype, "nuevaSalida", null);
__decorate([
    (0, common_1.Post)('nuevaEntrada'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MovimientosController.prototype, "nuevaEntrada", null);
MovimientosController = __decorate([
    (0, common_1.Controller)('movimientos')
], MovimientosController);
exports.MovimientosController = MovimientosController;
//# sourceMappingURL=movimientos.controller.js.map