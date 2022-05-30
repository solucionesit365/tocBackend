"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.familiasInstance = exports.FamiliasClass = void 0;
const schFamilias = require("./familias.mongodb");
class FamiliasClass {
    insertarFamilias(arrayFamilias) {
        return schFamilias.insertarFamilias(arrayFamilias).then((res) => {
            return res.acknowledged;
        }).catch((err) => {
            console.log(err);
            return false;
        });
    }
}
exports.FamiliasClass = FamiliasClass;
exports.familiasInstance = new FamiliasClass();
//# sourceMappingURL=familias.class.js.map