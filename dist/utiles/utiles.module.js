"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilesModule = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
let UtilesModule = class UtilesModule {
    static checkVariable(...args) {
        for (let i = 0; i < args.length; i++) {
            if (args[i] == undefined || args[i] == null) {
                return false;
            }
        }
        return true;
    }
    static generateUuid() {
        return (0, uuid_1.v4)();
    }
    static restarDiasTimestamp(fechaMilisegundos) {
        return fechaMilisegundos - (15 * 24 * 60 * 60 * 1000);
    }
};
UtilesModule = __decorate([
    (0, common_1.Module)({})
], UtilesModule);
exports.UtilesModule = UtilesModule;
//# sourceMappingURL=utiles.module.js.map