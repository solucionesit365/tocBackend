import { conexion } from "../conexion/mongodb";
import { MenusInterface } from "./menus.interface";

/* Eze 4.0 */
export async function getMenus(): Promise<MenusInterface[]> {
  const database = (await conexion).db("tocgame");
  const menus = database.collection<MenusInterface>("menus");
  return await menus.find().toArray();
}

export async function getTecladoMain(nombreMenu: string): Promise<any> {
  const database = (await conexion).db("tocgame");
  const teclas = database.collection("teclas");
  const resultado = await teclas.find({ nomMenu: nombreMenu }).toArray();

  return resultado;
}

/* Eze 4.0 */
export async function borrarMenus(): Promise<void> {
  const database = (await conexion).db("tocgame");
  const collectionList = await database.listCollections().toArray();
  for (let i = 0; i < collectionList.length; i++) {
    if (collectionList[i].name === "menus") {
      await database.collection("menus").drop();
      break;
    }
  }
}

/* Eze 4.0 */
export async function insertarMenus(
  arrayMenus: MenusInterface[]
): Promise<boolean> {
  await borrarMenus();
  const database = (await conexion).db("tocgame");
  const menus = database.collection<MenusInterface>("menus");
  return (await menus.insertMany(arrayMenus)).acknowledged;
}

export async function getSubmenus(tag: string) {
  const database = (await conexion).db("tocgame");
  const menus = database.collection("menus");
  const resultado = await (await menus.find({ tag: tag })).toArray();
  return resultado;
}
