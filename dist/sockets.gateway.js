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
exports.SocketGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const trabajadores_clase_1 = require("./trabajadores/trabajadores.clase");
const cestas_clase_1 = require("./cestas/cestas.clase");
const tickets_clase_1 = require("./tickets/tickets.clase");
const movimientos_clase_1 = require("./movimientos/movimientos.clase");
const parametros_clase_1 = require("./parametros/parametros.clase");
const utiles_module_1 = require("./utiles/utiles.module");
const paytef_class_1 = require("./paytef/paytef.class");
const dgram_1 = require("dgram");
const net = require('net');
const fs = require("fs");
let SocketGateway = class SocketGateway {
    enviar(canal, data) {
        this.server.emit(canal, data);
    }
    test(params) {
        this.server.emit('test', 'O Rei Ezeee');
    }
    consultarPuntos(params) {
        if (params != undefined) {
            if (params.idClienteFinal != undefined) {
                this.server.emit('resConsultaPuntos', { error: false, info: 69 });
            }
            else {
                this.server.emit('resConsultaPuntos', { error: true, mensaje: 'Backend: Faltan datos en socket > consultarPuntos' });
            }
        }
        else {
            this.server.emit('resConsultaPuntos', { error: true, mensaje: 'Backend: Faltan datos en socket > consultarPuntos' });
        }
    }
    async cobrarConClearone(params) {
        if (params != undefined) {
            if (params.total != undefined && params.idCesta != undefined) {
                let total = params.total;
                let idCesta = params.idCesta;
                const idClienteFinal = (params.idClienteFinal != undefined) ? (params.idClienteFinal) : ('');
                const infoTrabajador = await trabajadores_clase_1.trabajadoresInstance.getCurrentTrabajador();
                const nuevoIdTicket = (await tickets_clase_1.ticketsInstance.getUltimoTicket()) + 1;
                const cesta = await cestas_clase_1.cestas.getCestaByTrabajadorID(infoTrabajador.idTrabajador);
                if (cesta == null || cesta.lista.length == 0) {
                    console.log("Error, la cesta es null o está vacía");
                    this.server.emit('resDatafono', {
                        error: true,
                        mensaje: 'Error, la cesta es null o está vacía',
                    });
                }
                const info = {
                    _id: nuevoIdTicket,
                    timestamp: Date.now(),
                    total: total,
                    lista: cesta.lista,
                    tipoPago: "TARJETA",
                    idTrabajador: infoTrabajador._id,
                    tiposIva: cesta.tiposIva,
                    cliente: idClienteFinal,
                    infoClienteVip: {
                        esVip: false,
                        nif: '',
                        nombre: '',
                        cp: '',
                        direccion: '',
                        ciudad: ''
                    },
                    enviado: false,
                    enTransito: false,
                    intentos: 0,
                    comentario: '',
                    regalo: (cesta.regalo == true && idClienteFinal != '' && idClienteFinal != null) ? (true) : (false)
                };
                const client = new net.Socket();
                const aux = this;
                let ventaCliente = null;
                let tienda = null;
                let tpv = null;
                let file = null;
                let arr = [];
                try {
                    file = fs.readFileSync("/home/hit/clearOne/CoLinux.cfg", "utf8");
                    arr = file.split(/\r?\n/);
                }
                catch (err) {
                    console.log("Error: No se ha podido leer el archivo CoLinux");
                }
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].includes('[CLIENTE]')) {
                        ventaCliente = Number(arr[i + 1]);
                    }
                    else if (arr[i].includes('[TIENDA]')) {
                        tienda = Number(arr[i + 1]);
                    }
                    else if (arr[i].includes('[TPV]')) {
                        tpv = Number(arr[i + 1]);
                    }
                }
                client.connect(8890, '127.0.0.1', function () {
                    const nombreDependienta = '';
                    const numeroTicket = info._id;
                    const tipoOperacion = 1;
                    const importe = Number((info.total * 100).toFixed(2)).toString();
                    const venta_t = `\x02${ventaCliente};${tienda};${tpv};ezequiel;${numeroTicket};${tipoOperacion};${importe};;;;;;;\x03`;
                    client.write(venta_t);
                });
                client.on('error', function (err) {
                    console.log(err);
                    aux.server.emit('resDatafono', {
                        error: true,
                        mensaje: 'Error, mirar log en backend'
                    });
                });
                client.on('data', async function (data) {
                    const objEnviar = {
                        data: data,
                        objTicket: info,
                        idCesta: idCesta
                    };
                    let respuestaTexto = "";
                    for (let i = 0; i < objEnviar.data.length; i++) {
                        respuestaTexto += String.fromCharCode(objEnviar.data[i]);
                    }
                    if (respuestaTexto.includes("DENEGADA") == false && respuestaTexto.includes("denegada") == false && respuestaTexto.includes("ERROR") == false && respuestaTexto.includes("error") == false && objEnviar.data[0] == 2 && objEnviar.data[1] == 48 && objEnviar.data[2] == 59) {
                        movimientos_clase_1.movimientosInstance.nuevaSalida(objEnviar.objTicket.total, 'Targeta', 'TARJETA', false, objEnviar.objTicket._id);
                        if (await tickets_clase_1.ticketsInstance.insertarTicket(objEnviar.objTicket)) {
                            if (await cestas_clase_1.cestas.borrarCesta(objEnviar.idCesta)) {
                                if (await parametros_clase_1.parametrosInstance.setUltimoTicket(objEnviar.objTicket._id)) {
                                    aux.server.emit('resDatafono', {
                                        error: false,
                                    });
                                }
                                else {
                                    aux.server.emit('resDatafono', {
                                        error: true,
                                        mensaje: 'Error no se ha podido cambiar el último id ticket'
                                    });
                                }
                            }
                            else {
                                aux.server.emit('resDatafono', {
                                    error: true,
                                    mensaje: 'Error, no se ha podido borrar la cesta'
                                });
                            }
                        }
                        else {
                            aux.server.emit('resDatafono', {
                                error: true,
                                mensaje: 'Error, no se ha podido insertar el ticket'
                            });
                        }
                    }
                    else {
                        console.log("Denegada: ", objEnviar.data);
                        aux.server.emit('resDatafono', {
                            error: true,
                            mensaje: 'Error, operación DENEGADA'
                        });
                    }
                    client.write('\x02ACK\x03');
                    client.destroy();
                });
                client.on('close', function () {
                    console.log('Conexión cerrada');
                    client.destroy();
                });
            }
            else {
                this.server.emit('resDatafono', {
                    error: true,
                    mensaje: 'Faltan datos en gateway enviarAlDatafono'
                });
            }
        }
        else {
            this.server.emit('resDatafono', {
                error: true,
                mensaje: 'Faltan TODOS los datos en gateway enviarAlDatafono'
            });
        }
    }
    iniciarPaytef(params, client) {
        if (utiles_module_1.UtilesModule.checkVariable(params)) {
            if (utiles_module_1.UtilesModule.checkVariable(params)) {
                if (utiles_module_1.UtilesModule.checkVariable(params.idClienteFinal)) {
                    paytef_class_1.paytefInstance.iniciarTransaccion(client, params.idClienteFinal);
                }
                else {
                    client.emit('consultaPaytef', { error: true, mensaje: 'Backend: paytef/iniciarTransaccion faltan datos idClienteFinal' });
                }
            }
            else {
                client.emit('consultaPaytef', { error: true, mensaje: 'Backend: paytef/iniciarTransaccion faltan todos los datos' });
            }
        }
        else {
            client.emit('consultaPaytef', { error: true, mensaje: 'Error, faltan datos en socket => iniciarTransaccion' });
        }
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", dgram_1.Socket)
], SocketGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('test'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SocketGateway.prototype, "test", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('consultarPuntos'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SocketGateway.prototype, "consultarPuntos", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('enviarAlDatafono'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SocketGateway.prototype, "cobrarConClearone", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('iniciarTransaccion'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dgram_1.Socket]),
    __metadata("design:returntype", void 0)
], SocketGateway.prototype, "iniciarPaytef", null);
SocketGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: true,
            credentials: true,
            transports: ['websocket', 'polling'],
        },
        allowEIO3: true
    })
], SocketGateway);
exports.SocketGateway = SocketGateway;
//# sourceMappingURL=sockets.gateway.js.map