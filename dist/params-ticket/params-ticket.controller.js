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
exports.ParamsTicketController = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const parametros_clase_1 = require("../parametros/parametros.clase");
const params_ticket_class_1 = require("./params-ticket.class");
let ParamsTicketController = class ParamsTicketController {
    descargarInfoTicket() {
        const parametros = parametros_clase_1.parametrosInstance.getParametros();
        return axios_1.default.post('info-ticket/getInfoTicket', { database: parametros.database, idCliente: parametros.codigoTienda }).then((res) => {
            return params_ticket_class_1.paramsTicketInstance.insertarParametrosTicket(res.data.info).then((res2) => {
                if (res2) {
                    return { error: false };
                }
                return { error: true, mensaje: 'Backend: Error en params-ticket/descargarInfoTicket > insertarParametrosTicket' };
            });
        }).catch((err) => {
            console.log(err);
            return { error: true, mensaje: 'Backend: Error en params-ticket/descargarInfoTicket CATCH' };
        });
    }
};
__decorate([
    (0, common_1.Post)('descargarInfoTicket'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ParamsTicketController.prototype, "descargarInfoTicket", null);
ParamsTicketController = __decorate([
    (0, common_1.Controller)('params-ticket')
], ParamsTicketController);
exports.ParamsTicketController = ParamsTicketController;
//# sourceMappingURL=params-ticket.controller.js.map