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
exports.PromocionesController = void 0;
const common_1 = require("@nestjs/common");
const utiles_module_1 = require("../utiles/utiles.module");
const promociones_clase_1 = require("./promociones.clase");
let PromocionesController = class PromocionesController {
    setEstadoPromociones(params) {
        if (utiles_module_1.UtilesModule.checkVariable(params.estadoPromociones)) {
            promociones_clase_1.ofertas.setEstadoPromociones(params.estadoPromociones);
            return { error: false };
        }
        else {
            return { error: true, mensaje: 'Error, faltan datos' };
        }
    }
};
__decorate([
    (0, common_1.Post)('setEstadoPromociones'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PromocionesController.prototype, "setEstadoPromociones", null);
PromocionesController = __decorate([
    (0, common_1.Controller)('promociones')
], PromocionesController);
exports.PromocionesController = PromocionesController;
//# sourceMappingURL=promociones.controller.js.map