export declare class ImpresoraController {
    imprimirTicket(params: any): void;
    abrirCajon(): void;
    imprimirEntregas(): Promise<{
        error: boolean;
        info: string;
    } | {
        error: boolean;
        info: string;
    }>;
}
