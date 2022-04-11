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
exports.MenusController = void 0;
const common_1 = require("@nestjs/common");
const menus_clase_1 = require("./menus.clase");
let MenusController = class MenusController {
    clickMenu(params) {
        if (menus_clase_1.menusInstance.getBloqueado() == false) {
            menus_clase_1.menusInstance.setBloqueado(true);
            return menus_clase_1.menusInstance.clickMenu(params.nombreMenu).then((res) => {
                menus_clase_1.menusInstance.setBloqueado(false);
                return {
                    bloqueado: false,
                    resultado: res
                };
            }).catch((err) => {
                menus_clase_1.menusInstance.setBloqueado(false);
                return {
                    bloqueado: false,
                    error: err
                };
            });
        }
        else {
            return {
                bloqueado: true
            };
        }
    }
    getMenus() {
        return menus_clase_1.menusInstance.getMenus().then((resultado) => {
            if (menus_clase_1.menusInstance.getBloqueado() == false) {
                return { bloqueado: false, resultado: resultado };
            }
            else {
                return { bloqueado: true };
            }
        });
    }
    getSubmenus(params) {
        return menus_clase_1.menusInstance.getSubmenus(params.tag).then((res) => {
            if (!menus_clase_1.menusInstance.getBloqueado())
                return { bloqueado: false, resultado: res };
            return { bloqueado: true };
        });
    }
};
__decorate([
    (0, common_1.Post)('clickMenu'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MenusController.prototype, "clickMenu", null);
__decorate([
    (0, common_1.Post)('getMenus'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MenusController.prototype, "getMenus", null);
__decorate([
    (0, common_1.Post)('getSubmenus'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MenusController.prototype, "getSubmenus", null);
MenusController = __decorate([
    (0, common_1.Controller)('menus')
], MenusController);
exports.MenusController = MenusController;
//# sourceMappingURL=menus.controller.js.map