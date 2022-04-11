declare class TocSockets {
    private socket;
    iniciarSockets(): void;
    emit(canal: string, data?: any): void;
}
export declare const socket: TocSockets;
export {};
