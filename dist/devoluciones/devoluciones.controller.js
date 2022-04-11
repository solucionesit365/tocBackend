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
exports.DevolucionesController = void 0;
const common_1 = require("@nestjs/common");
const devoluciones_clase_1 = require("./devoluciones.clase");
let DevolucionesController = class DevolucionesController {
    nuevaDevolucion(params) {
        if (params.total != undefined && params.idCesta != undefined) {
            return devoluciones_clase_1.devolucionesInstance.nuevaDevolucion(params.total, params.idCesta).then((res) => {
                if (res) {
                    return { error: false };
                }
                else {
                    return { error: true, mensaje: 'Error en nuevaDevolucion()' };
                }
            }).catch((err) => {
                console.log(err);
                return { error: true, mensaje: 'Error, ver log en nest' };
            });
        }
        else {
            return { error: true, mensaje: 'Datos no definidos' };
        }
    }
};
__decorate([
    (0, common_1.Post)('nuevaDevolucion'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DevolucionesController.prototype, "nuevaDevolucion", null);
DevolucionesController = __decorate([
    (0, common_1.Controller)('devoluciones')
], DevolucionesController);
exports.DevolucionesController = DevolucionesController;
//# sourceMappingURL=devoluciones.controller.js.map