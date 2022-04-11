import * as schParamsTicket from './params-ticket.mongo';

export class ParamsTicketClass {
    insertarParametrosTicket(data) {
        return schParamsTicket.insertarParametrosTicket(data).then((res) => {
            if(res) {
                return true;
            } else {
                return false;
            }
        }).catch((err) => {
            console.log(err);
            return false;
        });
    }

    getParamsTicket() {
        return schParamsTicket.getParamsTicket().then((res) => {
            return res;
        }).catch((err) => {
            console.log(err);
            return [];
        });
    }
}
export const paramsTicketInstance = new ParamsTicketClass();
