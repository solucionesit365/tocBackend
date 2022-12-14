import { FamiliasInterface } from "./familias.interface";
import * as schFamilias from "./familias.mongodb";
import { logger } from "../logger";

export class FamiliasClass {
  /* Eze 4.0 */
  async insertarFamilias(arrayFamilias: FamiliasInterface[]) {
    try {
      return await schFamilias.insertarFamilias(arrayFamilias);
    } catch (err) {
      logger.Error(74, err);
      return false;
    }
  }
}
export const familiasInstance = new FamiliasClass();
