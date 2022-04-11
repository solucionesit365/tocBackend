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
exports.TicketsController = void 0;
const common_1 = require("@nestjs/common");
const tickets_clase_1 = require("./tickets.clase");
const caja_clase_1 = require("../caja/caja.clase");
let TicketsController = class TicketsController {
    getTicketsIntervalo(params) {
        return caja_clase_1.cajaInstance.getInfoCaja().then((infoCaja) => {
            if (infoCaja != null) {
                return tickets_clase_1.ticketsInstance.getTicketsIntervalo(infoCaja.inicioTime, Date.now());
            }
            else {
                return [];
            }
        }).catch((err) => {
            console.log(err);
            return [];
        });
    }
    crearTicketEfectivo(params) {
        if (params.total != undefined && params.idCesta != undefined && params.idCliente != undefined) {
            return tickets_clase_1.ticketsInstance.crearTicketEfectivo(params.total, params.idCesta, params.idCliente).then((res) => {
                if (res) {
                    return {
                        error: false
                    };
                }
                else {
                    return {
                        error: true,
                        mensaje: 'Error en crearTicketEfectivo'
                    };
                }
            }).catch((err) => {
                console.log(err);
                return {
                    error: true,
                    mensaje: 'Error. Comprobar log nest'
                };
            });
        }
        else {
            return { error: true, mensaje: 'Faltan datos' };
        }
    }
    crearTicketDatafono3G(params) {
        if (params.total != undefined && params.idCesta != undefined && params.idCliente != undefined) {
            return tickets_clase_1.ticketsInstance.crearTicketDatafono3G(params.total, params.idCesta, params.idCliente).then((res) => {
                if (res) {
                    return {
                        error: false
                    };
                }
                else {
                    return {
                        error: true,
                        mensaje: 'Error en crearTicketDatafono3G'
                    };
                }
            }).catch((err) => {
                console.log(err);
                return {
                    error: true,
                    mensaje: 'Error. Comprobar log nest'
                };
            });
        }
        else {
            return { error: true, mensaje: 'Faltan datos' };
        }
    }
    crearTicketDeuda(params) {
        if (params.total != undefined && params.idCesta != undefined && params.idCliente != undefined && params.infoClienteVip != undefined) {
            return tickets_clase_1.ticketsInstance.crearTicketDeuda(params.total, params.idCesta, params.idCliente, params.infoClienteVip).then((res) => {
                if (res) {
                    return { error: false };
                }
                return { error: true, mensaje: 'Backend: Error en tickets/crearTicketDeuda' };
            }).catch((err) => {
                console.log(err);
                return { error: true, mensaje: 'Backend: Error en tickets/crearTicketDeuda CATCH' };
            });
        }
        else {
            return { error: true, mensaje: 'Faltan datos en tickets/crearTicketDeuda' };
        }
    }
    crearTicketConsumoPersonal(params) {
        if (params.idCesta != undefined) {
            return tickets_clase_1.ticketsInstance.crearTicketConsumoPersonal(params.idCesta).then((res) => {
                if (res) {
                    return { error: false };
                }
                return { error: true, mensaje: 'Backend: Error en tickets/crearTicketConsumoPersonal' };
            }).catch((err) => {
                console.log(err);
                return { error: true, mensaje: 'Backend: Error en tickets/crearTicketConsumoPersonal CATCH' };
            });
        }
        else {
            return { error: true, mensaje: 'Faltan datos en tickets/crearTicketConsumoPersonal' };
        }
    }
    crearTicketTKRS(params) {
        if (params.total != undefined && params.idCesta != undefined && params.idCliente != undefined) {
            return tickets_clase_1.ticketsInstance.crearTicketTKRS(params.total, params.totalTkrs, params.idCesta, params.idCliente).then((res) => {
                if (res) {
                    return { error: false };
                }
                return { error: true, mensaje: 'Backend: Error en tickets/crearTicketTKRS' };
            }).catch((err) => {
                console.log(err);
                return { error: true, mensaje: 'Backend: Error en tickets/crearTicketTKRS CATCH' };
            });
        }
        else {
            return { error: true, mensaje: 'Faltan datos en tickets/crearTicketTKRS' };
        }
    }
    getListadoVentas(params) {
        {
            if (params.start && params.end) {
                return tickets_clase_1.ticketsInstance.getTicketsIntervalo(params.start, params.end);
            }
        }
    }
};
__decorate([
    (0, common_1.Post)('getTicketsIntervalo'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "getTicketsIntervalo", null);
__decorate([
    (0, common_1.Post)('crearTicketEfectivo'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "crearTicketEfectivo", null);
__decorate([
    (0, common_1.Post)('crearTicketDatafono3G'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "crearTicketDatafono3G", null);
__decorate([
    (0, common_1.Post)('crearTicketDeuda'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "crearTicketDeuda", null);
__decorate([
    (0, common_1.Post)('crearTicketConsumoPersonal'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "crearTicketConsumoPersonal", null);
__decorate([
    (0, common_1.Post)('crearTicketTKRS'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "crearTicketTKRS", null);
__decorate([
    (0, common_1.Get)('getListadoVentas'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "getListadoVentas", null);
TicketsController = __decorate([
    (0, common_1.Controller)('tickets')
], TicketsController);
exports.TicketsController = TicketsController;
//# sourceMappingURL=tickets.controller.js.map