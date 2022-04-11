import { ParametrosInterface } from "./parametros.interface";
export declare class ParametrosClase {
    private parametros;
    constructor();
    getParametros(): ParametrosInterface;
    getEspecialParametros(): Promise<ParametrosInterface | null>;
    setParametros(params: ParametrosInterface): Promise<boolean>;
    todoInstalado(): boolean;
    checkParametrosOK(params: ParametrosInterface): boolean;
    actualizarParametros(): void;
    setUltimoTicket(idTicket: number): Promise<boolean>;
    setVidAndPid(vid: string, pid: string): Promise<boolean>;
    setIpPaytef(ip: string): Promise<boolean>;
}
declare const parametrosInstance: ParametrosClase;
export { parametrosInstance };
