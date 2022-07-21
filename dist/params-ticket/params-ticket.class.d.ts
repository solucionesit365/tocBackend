export declare class ParamsTicketClass {
    insertarParametrosTicket(data: any): Promise<boolean>;
    getParamsTicket(): Promise<any[] | import("bson").Document[]>;
}
export declare const paramsTicketInstance: ParamsTicketClass;
