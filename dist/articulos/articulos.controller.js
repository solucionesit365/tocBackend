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
exports.ArticulosController = void 0;
const common_1 = require("@nestjs/common");
const clientes_clase_1 = require("../clientes/clientes.clase");
const articulos_clase_1 = require("./articulos.clase");
let ArticulosController = class ArticulosController {
    getArticulo(params) {
        return articulos_clase_1.articulosInstance.getInfoArticulo(params.idArticulo).then((res) => {
            if (res != null) {
                return { error: false, info: res };
            }
            else {
                return { error: true, mensaje: 'Backend: Error, el articulo es null' };
            }
        }).catch((err) => {
            console.log(err);
            return { error: true, mensaje: 'Backend: Error en articulos/getArticulo catch' };
        });
    }
    setEstadoTarifaEspecial(params) {
        if (params.nuevoEstado != undefined && params.nuevoEstado != null) {
            articulos_clase_1.articulosInstance.setEstadoTarifaEspecial(params.nuevoEstado);
            clientes_clase_1.clienteInstance.setEstadoClienteVIP(false);
            return { error: false };
        }
        else {
            return { error: true, mensaje: 'Backend: Faltan datos en articulos/setEstadoTarifaVIP' };
        }
    }
    editarArticulo(params) {
        if (params.idArticulo && params.nombre && params.precioBase && params.precioConIva) {
            console.log('Hola', params.idArticulo, params.nombre, params.precioBase, params.precioConIva);
            return articulos_clase_1.articulosInstance.editarArticulo(params.idArticulo, params.nombre, params.precioBase, params.precioConIva).then((res) => {
                if (res) {
                    return { error: false, info: res };
                }
                return { error: true, mensaje: 'Backend: Error, faltan datos' };
            });
        }
        else {
            return { error: true, mensaje: 'Backend: Faltan datos en articulos/editarArticulo' };
        }
    }
};
__decorate([
    (0, common_1.Post)('getArticulo'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ArticulosController.prototype, "getArticulo", null);
__decorate([
    (0, common_1.Post)('setEstadoTarifaVIP'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ArticulosController.prototype, "setEstadoTarifaEspecial", null);
__decorate([
    (0, common_1.Post)('editarArticulo'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ArticulosController.prototype, "editarArticulo", null);
ArticulosController = __decorate([
    (0, common_1.Controller)('articulos')
], ArticulosController);
exports.ArticulosController = ArticulosController;
//# sourceMappingURL=articulos.controller.js.map