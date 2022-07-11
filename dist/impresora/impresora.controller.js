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
exports.ImpresoraController = void 0;
const common_1 = require("@nestjs/common");
const impresora_class_1 = require("./impresora.class");
let ImpresoraController = class ImpresoraController {
    imprimirTicket(params) {
        const idTicket = params.idTicket;
        impresora_class_1.impresoraInstance.imprimirTicket(idTicket);
    }
    abrirCajon() {
        impresora_class_1.impresoraInstance.abrirCajon();
    }
    imprimirEntregas() {
        return impresora_class_1.impresoraInstance.imprimirEntregas();
    }
    despedircliente() {
        return impresora_class_1.impresoraInstance.despedircliente();
    }
    binvenidacliente() {
        return impresora_class_1.impresoraInstance.binvenidacliente();
    }
};
__decorate([
    (0, common_1.Post)('imprimirTicket'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ImpresoraController.prototype, "imprimirTicket", null);
__decorate([
    (0, common_1.Post)('abrirCajon'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ImpresoraController.prototype, "abrirCajon", null);
__decorate([
    (0, common_1.Post)('imprimirEntregas'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ImpresoraController.prototype, "imprimirEntregas", null);
__decorate([
    (0, common_1.Post)('despedida'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ImpresoraController.prototype, "despedircliente", null);
__decorate([
    (0, common_1.Post)('bienvenida'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ImpresoraController.prototype, "binvenidacliente", null);
ImpresoraController = __decorate([
    (0, common_1.Controller)('impresora')
], ImpresoraController);
exports.ImpresoraController = ImpresoraController;
//# sourceMappingURL=impresora.controller.js.map