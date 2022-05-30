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
exports.DobleMenusController = void 0;
const common_1 = require("@nestjs/common");
const menus_clase_1 = require("../menus/menus.clase");
const doble_menus_clase_1 = require("./doble-menus.clase");
let DobleMenusController = class DobleMenusController {
    clickMenu(params) {
        if (!doble_menus_clase_1.dobleMenusInstance.getBloqueado()) {
            doble_menus_clase_1.dobleMenusInstance.setBloqueado(true);
            return menus_clase_1.menusInstance.getSubmenus(params.tag).then((res) => {
                doble_menus_clase_1.dobleMenusInstance.setBloqueado(false);
                return {
                    bloqueado: false,
                    resultado: res,
                };
            }).catch((err) => {
                menus_clase_1.menusInstance.setBloqueado(false);
                return {
                    bloqueado: false,
                    error: err,
                };
            });
        }
        else {
            return {
                bloqueado: true,
            };
        }
    }
    getMenus() {
        return doble_menus_clase_1.dobleMenusInstance.getMenus().then((resultado) => {
            if (!doble_menus_clase_1.dobleMenusInstance.getBloqueado()) {
                return { bloqueado: false, resultado: resultado };
            }
            else {
                return { bloqueado: true };
            }
        });
    }
};
__decorate([
    (0, common_1.Post)('clickMenu'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DobleMenusController.prototype, "clickMenu", null);
__decorate([
    (0, common_1.Post)('getMenus'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DobleMenusController.prototype, "getMenus", null);
DobleMenusController = __decorate([
    (0, common_1.Controller)('doble-menus')
], DobleMenusController);
exports.DobleMenusController = DobleMenusController;
//# sourceMappingURL=doble-menus.controller.js.map