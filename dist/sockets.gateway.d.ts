/// <reference types="node" />
import { Socket } from 'dgram';
export declare class SocketGateway {
    private tpv;
    server: Socket;
    enviar(canal: string, data: any): void;
    handleConnection(client: any, ...args: any[]): void;
    handleDisconnect(): void;
    test(params: any): void;
    consultarPuntos(params: any): void;
    cobrarConClearone(params: any): Promise<void>;
    iniciarPaytef(params: any, client: Socket): void;
}
