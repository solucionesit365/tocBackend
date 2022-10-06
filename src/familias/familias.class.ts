import { FamiliasInterface } from "./familias.interface";
import * as schFamilias from "./familias.mongodb";

export class FamiliasClass {
  /* Eze 4.0 */
  async insertarFamilias(arrayFamilias: FamiliasInterface[]) {
    try {
      return await schFamilias.insertarFamilias(arrayFamilias);
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
export const familiasInstance = new FamiliasClass();
