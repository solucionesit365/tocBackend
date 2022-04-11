export declare class ParametrosController {
    todoInstalado(): {
        todoInstalado: true;
        config: import("./parametros.interface").ParametrosInterface;
    } | {
        todoInstalado: boolean;
        config?: undefined;
    };
    getParametros(): {
        error: boolean;
        parametros: import("./parametros.interface").ParametrosInterface;
    };
    getParametrosBonito(): {
        error: boolean;
        parametros: import("./parametros.interface").ParametrosInterface;
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
        info: import("./parametros.interface").ParametrosInterface;
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
