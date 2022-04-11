/// <reference types="node" />
import { Socket } from 'dgram';
export declare class SocketGateway {
    server: Socket;
    enviar(canal: string, data: any): void;
    test(params: any): void;
    consultarPuntos(params: any): void;
    cobrarConClearone(params: any): Promise<void>;
    iniciarPaytef(params: any, client: Socket): void;
}
