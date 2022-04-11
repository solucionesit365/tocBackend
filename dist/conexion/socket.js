"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socket = void 0;
const socket_io_client_1 = require("socket.io-client");
const parametros_clase_1 = require("../parametros/parametros.clase");
const SERVER_URL = "https://sanpedroserver.com";
class TocSockets {
    iniciarSockets() {
        const parametros = parametros_clase_1.parametrosInstance.getParametros();
        let tipoEntorno = SERVER_URL;
        if (tipoEntorno == SERVER_URL) {
            this.socket = (parametros == null || typeof parametros.token === 'undefined') ? socket_io_client_1.io.connect(tipoEntorno) : (socket_io_client_1.io.connect(tipoEntorno, { query: `token=${parametros.token}` }));
        }
        else {
            this.socket = null;
        }
    }
    emit(canal, data = null) {
        (data == null) ? (exports.socket.emit(canal)) : (exports.socket.emit(canal, data));
    }
}
exports.socket = new TocSockets();
//# sourceMappingURL=socket.js.map