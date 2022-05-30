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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TurnosController = void 0;
const common_1 = require("@nestjs/common");
const turnos_class_1 = require("./turnos.class");
let TurnosController = class TurnosController {
    getPlanes() {
        const turnosInstance = new turnos_class_1.TurnosClass();
        return turnosInstance.getPlanes().then((res) => {
            if (res.error == false) {
                return { error: false, info: res.info };
            }
            return { error: true, mensaje: res.mensaje };
        }).catch((err) => {
            console.log(err);
            return { error: true, mensaje: 'Error: Backend turnos/getPlanes CATCH' };
        });
    }
};
__decorate([
    (0, common_1.Get)('getPlanes'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TurnosController.prototype, "getPlanes", null);
TurnosController = __decorate([
    (0, common_1.Controller)('turnos')
], TurnosController);
exports.TurnosController = TurnosController;
//# sourceMappingURL=turnos.controller.js.map