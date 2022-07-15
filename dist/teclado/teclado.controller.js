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
exports.TecladoController = void 0;
const common_1 = require("@nestjs/common");
const cestas_clase_1 = require("../cestas/cestas.clase");
const teclado_clase_1 = require("./teclado.clase");
const promociones_clase_1 = require("../promociones/promociones.clase");
let TecladoController = class TecladoController {
    clickTecla(params) {
        return cestas_clase_1.cestas.addItem(params.idArticulo, params.idBoton, params.peso, params.infoPeso, params.idCesta).then((res) => {
            return {
                error: false,
                bloqueado: false,
                cesta: res
            };
        }).catch((err) => {
            console.log(err);
            return {
                error: true,
                mensaje: "Error en addItem"
            };
        });
    }
    actualizarArticulos() {
        return teclado_clase_1.tecladoInstance.actualizarTeclado();
    }
    cambiarPosTecla(params) {
        if (params.idArticle && params.nuevaPos && params.nombreMenu) {
            return teclado_clase_1.tecladoInstance.cambiarPosTecla(params.idArticle, params.nuevaPos, params.nombreMenu).then((res) => {
                if (res) {
                    return { error: false, info: res };
                }
                return { error: true, mensaje: 'Error en teclado/cambiarPosTecla' };
            });
        }
        else {
            return { error: true, mensaje: 'Faltan datos en teclado/cambiarPosTecla' };
        }
    }
};
__decorate([
    (0, common_1.Post)('clickTeclaArticulo'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TecladoController.prototype, "clickTecla", null);
__decorate([
    (0, common_1.Post)('actualizarTeclado'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TecladoController.prototype, "actualizarArticulos", null);
__decorate([
    (0, common_1.Post)('cambiarPosTecla'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TecladoController.prototype, "cambiarPosTecla", null);
TecladoController = __decorate([
    (0, common_1.Controller)('teclado')
], TecladoController);
exports.TecladoController = TecladoController;
//# sourceMappingURL=teclado.controller.js.map