import * as schFamilias from './familias.mongodb';

export class FamiliasClass {
    insertarFamilias(arrayFamilias) {
        return schFamilias.insertarFamilias(arrayFamilias).then((res) => {
            return res.acknowledged;
        }).catch((err) => {
            console.log(err);
            return false;
        });
    }
}
export const familiasInstance = new FamiliasClass();