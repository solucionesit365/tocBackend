"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paramsTicketInstance = exports.ParamsTicketClass = void 0;
const schParamsTicket = require("./params-ticket.mongo");
class ParamsTicketClass {
    insertarParametrosTicket(data) {
        return schParamsTicket.insertarParametrosTicket(data).then((res) => {
            if (res) {
                return true;
            }
            else {
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
exports.ParamsTicketClass = ParamsTicketClass;
exports.paramsTicketInstance = new ParamsTicketClass();
//# sourceMappingURL=params-ticket.class.js.map