import { ParametrosInterface } from './parametros.interface';
export declare class ParametrosController {
    todoInstalado(): {
        todoInstalado: true;
        config: ParametrosInterface;
    } | {
        todoInstalado: boolean;
        config?: undefined;
    };
    getParametros(): {
        error: boolean;
        parametros: ParametrosInterface;
    };
    actualizarParametros(): Promise<{
        error: boolean;
        mensaje?: undefined;
    } | {
        error: boolean;
        mensaje: string;
    } | {
        error: boolean;
        mensaje: string;
    } | {
        error: boolean;
        mensaje: string;
    }>;
    getParametrosBonito(): {
        error: boolean;
        parametros: ParametrosInterface;
    };
    vidAndPid(params: any): Promise<{
        error: boolean;
        mensaje?: undefined;
    } | {
        error: boolean;
        mensaje: string;
    } | {
        error: boolean;
        mensaje: string;
    }> | {
        error: boolean;
        mensaje: string;
    };
    getVidAndPid(): Promise<{
        error: boolean;
        info: ParametrosInterface;
    } | {
        error: boolean;
        info: {
            impresoraUsbInfo: {
                vid: string;
                pid: string;
            };
        };
    } | {
        error: boolean;
        mensaje: string;
    }>;
    setIpPaytef(params: any): Promise<{
        error: boolean;
        mensaje?: undefined;
    } | {
        error: boolean;
        mensaje: string;
    } | {
        error: boolean;
        mensaje: string;
    }> | {
        error: boolean;
        mensaje: string;
    };
    getIpPaytef(): Promise<{
        error: boolean;
        info: string;
    } | {
        error: boolean;
        mensaje: string;
    }>;
}
