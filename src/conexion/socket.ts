import { io } from "socket.io-client";
import { parametrosInstance } from "../parametros/parametros.clase";

const SERVER_URL = "https://sanpedroserver.com";
// const parametros = await tocGame.parametros.getParametros();
// let tipoEntorno = '';

// // if(process.argv[2] == 'test') {
// //     tipoEntorno = 'http://localhost:8080'
// // } else {
// //     tipoEntorno = 'http://34.78.247.153:8080';
// // }

// tipoEntorno = "https://sanpedroserver.com";

// export const socket = (parametros == null || typeof parametros.token === 'undefined') ? io.connect(tipoEntorno) : (io.connect(tipoEntorno, {query: `token=${parametros.token}`}));

class TocSockets {
    private socket: any;

    iniciarSockets() {
        const parametros = parametrosInstance.getParametros();
        let tipoEntorno = SERVER_URL;
        if (tipoEntorno == SERVER_URL) {
            this.socket = (parametros == null || typeof parametros.token === 'undefined') ? io.connect(tipoEntorno) : (io.connect(tipoEntorno, {query: `token=${parametros.token}`}));
        } else {
            this.socket = null;
        }
    }

    emit(canal: string, data: any = null) {
        (data == null) ? (socket.emit(canal)) : (socket.emit(canal, data));
    }
}

export const socket = new TocSockets();