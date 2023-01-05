import { UtilesModule } from "../utiles/utiles.module";
import { conexion } from "../conexion/mongodb";
import {
  CuentaCodigoBarras,
  MovimientosInterface,
} from "./movimientos.interface";
import { TicketsInterface } from "../tickets/tickets.interface";

/* Eze 4.0 */
export async function getMovimientosIntervalo(
  inicioTime: number,
  finalTime: number
): Promise<MovimientosInterface[]> {
  const database = (await conexion).db("tocgame");
  const movimientos = database.collection<MovimientosInterface>("movimientos");
  return await movimientos
    .find({ _id: { $lte: finalTime, $gte: inicioTime } })
    .toArray();
}

/* Eze 4.0 */
export async function nuevoMovimiento(
  data: MovimientosInterface
): Promise<boolean> {
  const database = (await conexion).db("tocgame");
  const movimientos = database.collection<MovimientosInterface>("movimientos");
  return (await movimientos.insertOne(data)).acknowledged;
}

/* Eze 4.0 */
export async function getUltimoCodigoBarras(): Promise<
  CuentaCodigoBarras["ultimo"]
> {
  const database = (await conexion).db("tocgame");
  const codigoBarras = database.collection<CuentaCodigoBarras>("codigo-barras");
  const docCodigoBarras = await codigoBarras.findOne({ _id: "CUENTA" });
  if (docCodigoBarras) return docCodigoBarras.ultimo;
  else return null;
}

/* Eze 4.0 */
export async function resetContadorCodigoBarras(): Promise<boolean> {
  const database = (await conexion).db("tocgame");
  const codigoBarras = database.collection<CuentaCodigoBarras>("codigo-barras");
  return (
    await codigoBarras.updateOne(
      { _id: "CUENTA" },
      { $set: { ultimo: 0 } },
      { upsert: true }
    )
  ).acknowledged;
}

/* Eze 4.0 */
export async function actualizarCodigoBarras(): Promise<boolean> {
  const database = (await conexion).db("tocgame");
  const codigoBarras = database.collection<CuentaCodigoBarras>("codigo-barras");
  return (
    await codigoBarras.updateOne(
      { _id: "CUENTA" },
      { $inc: { ultimo: 1 } },
      { upsert: true } // Comprobado funciona sin que exista la colección
    )
  ).acknowledged;
}

/* Eze 4.0 */
export async function getMovimientoMasAntiguo(): Promise<MovimientosInterface> {
  const database = (await conexion).db("tocgame");
  const movimientos = database.collection<MovimientosInterface>("movimientos");
  return await movimientos.findOne({ enviado: false }, { sort: { _id: 1 } });
}

/* Eze 4.0 */
export async function limpiezaMovimientos(): Promise<boolean> {
  const database = (await conexion).db("tocgame");
  const movimientos = database.collection<MovimientosInterface>("movimientos");
  return (
    await movimientos.deleteMany({
      enviado: true,
      _id: { $lte: UtilesModule.restarDiasTimestamp(Date.now()) },
    })
  ).acknowledged;
}

/* Eze 4.0 */
export async function setMovimientoEnviado(
  movimiento: MovimientosInterface
): Promise<boolean> {
  const database = (await conexion).db("tocgame");
  const movimientos = database.collection<MovimientosInterface>("movimientos");
  const resultado = await movimientos.updateOne(
    { _id: movimiento._id },
    {
      $set: {
        enviado: true,
      },
    }
  );
  return resultado.acknowledged && resultado.modifiedCount > 0;
}

/* Eze 4.0 */
export async function getMovimientosDelTicket(
  idTicket: TicketsInterface["_id"]
) {
  const database = (await conexion).db("tocgame");
  const movimientosCollection =
    database.collection<MovimientosInterface>("movimientos");
  return await movimientosCollection.find({ idTicket: idTicket }).toArray();
}
