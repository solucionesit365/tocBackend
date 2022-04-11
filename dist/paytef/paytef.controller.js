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
exports.PaytefController = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const logs_class_1 = require("../logs/logs.class");
const transacciones_class_1 = require("../transacciones/transacciones.class");
const transacciones_interface_1 = require("../transacciones/transacciones.interface");
const utiles_module_1 = require("../utiles/utiles.module");
const parametros_clase_1 = require("../parametros/parametros.clase");
const paytef_class_1 = require("./paytef.class");
const exec = require('child_process').exec;
const os = require('os');
let PaytefController = class PaytefController {
    async comprobarEstado() {
        const ipDatafono = parametros_clase_1.parametrosInstance.getParametros().ipTefpay;
        const ultimaTransaccion = await transacciones_class_1.transaccionesInstance.getUltimaTransaccion();
        return axios_1.default.post(`http://${ipDatafono}:8887/transaction/poll`, {
            pinpad: "*"
        }).then((res) => {
            if (res.data.result != null && res.data.result != undefined) {
                if (res.data.result.transactionReference === ultimaTransaccion._id.toString()) {
                    if (res.data.result.approved && !res.data.result.failed) {
                        return paytef_class_1.paytefInstance.cerrarTicket(res.data.result.transactionReference).then((resCierreTicket) => {
                            if (resCierreTicket.error) {
                                return { error: true, mensaje: resCierreTicket.mensaje };
                            }
                            return { error: false, continuo: false };
                        });
                    }
                    else {
                        return { error: true, mensaje: 'Operación denegada' };
                    }
                }
                else {
                    return { error: false, continuo: true };
                }
            }
            else {
                if (res.data.info != null && res.data.info != undefined) {
                    if (res.data.info.transactionStatus === 'cancelling') {
                        return { error: true, mensaje: 'Operación cancelada' };
                    }
                    else {
                        return { error: false, continuo: true };
                    }
                }
                else {
                    return { error: false, continuo: true };
                }
            }
        }).catch((err) => {
            if (err.message == 'Request failed with status code 500') {
                return { error: false, continuo: true };
            }
            else {
                console.log(err.message);
                return { error: true, mensaje: "Error catch cobro paytef controller" };
            }
        });
    }
    cancelarOperacionActual() {
        const ipDatafono = parametros_clase_1.parametrosInstance.getParametros().ipTefpay;
        return axios_1.default.post(`http://${ipDatafono}:8887/pinpad/cancel`, { pinpad: "*" }).then((res) => {
            if (res.data.info.success === true) {
                return true;
            }
            else {
                return false;
            }
        }).catch((err) => {
            console.log(err);
            return false;
        });
    }
    buscarDispositivos() {
        exec("arp -a", (err, stdout, stderr) => {
            if (err) {
                console.log(err);
            }
            else {
                let ipTefpay = '';
                const arrayDevices = stdout.split(/\r?\n/);
                for (let i = 0; i < arrayDevices.length; i++) {
                    if (arrayDevices[i].includes('A30')) {
                        ipTefpay = arrayDevices[i].split(' ');
                        break;
                    }
                }
                console.log(ipTefpay);
            }
        });
    }
};
__decorate([
    (0, common_1.Get)('polling'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PaytefController.prototype, "comprobarEstado", null);
__decorate([
    (0, common_1.Get)('cancelarOperacionActual'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PaytefController.prototype, "cancelarOperacionActual", null);
__decorate([
    (0, common_1.Get)('scanDevices'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PaytefController.prototype, "buscarDispositivos", null);
PaytefController = __decorate([
    (0, common_1.Controller)('paytef')
], PaytefController);
exports.PaytefController = PaytefController;
//# sourceMappingURL=paytef.controller.js.map