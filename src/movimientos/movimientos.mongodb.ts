import { UtilesModule } from "../utiles/utiles.module";
import { conexion } from "../conexion/mongodb";
import { CuentaCodigoBarras, MovimientosInterface } from "./movimientos.interface";

/* Eze v23 */
export async function getMovimientosIntervalo(
  inicioTime: number,
  finalTime: number
): Promise<MovimientosInterface[]> {
  try {
    const database = (await conexion).db("tocgame");
    const movimientos = database.collection<MovimientosInterface>("movimientos");
    return await movimientos.find({ _id: { $lte: finalTime, $gte: inicioTime } }).toArray();
  } catch (err) {
    console.log(err);
    return [];
  }
}

/* Eze v23 */
export async function nuevoMovimiento(data: MovimientosInterface): Promise<boolean> {
  try {
    const database = (await conexion).db("tocgame");
    const movimientos = database.collection<MovimientosInterface>("movimientos");
    return (await movimientos.insertOne(data)).acknowledged;
  } catch (err) {
    console.log(err);
    return false;
  }
}

/* Eze v23 */
export async function getUltimoCodigoBarras(): Promise<CuentaCodigoBarras["ultimo"]> {
  try {
    const database = (await conexion).db("tocgame");
    const codigoBarras = database.collection<CuentaCodigoBarras>("codigo-barras");
    return (await codigoBarras.findOne({ _id: "CUENTA" })).ultimo;
  } catch (err) {
    console.log(err);
    return null;
  }
}

/* Eze v23 */
export async function resetContadorCodigoBarras(): Promise<boolean> {
  try {
    const database = (await conexion).db("tocgame");
    const codigoBarras = database.collection<CuentaCodigoBarras>("codigo-barras");
    return (await codigoBarras.updateOne(
      { _id: "CUENTA" },
      { $set: { ultimo: 0 } },
      { upsert: true }
    )).acknowledged;
  } catch (err) {
    console.log(err);
  }
}

/* Eze v23 */
export async function actualizarCodigoBarras(): Promise<boolean> {
  try {
    const database = (await conexion).db("tocgame");
    const codigoBarras = database.collection<CuentaCodigoBarras>("codigo-barras");
    return (await codigoBarras.updateOne(
      { _id: "CUENTA" },
      { $inc: { ultimo: 1 } },
      { upsert: true } // Comprobado funciona sin que exista la colección
    )).acknowledged;
  } catch (err) {
    console.log(err);
    return false;
  }
}

/* Eze v23 */
export async function getMovimientoMasAntiguo(): Promise<MovimientosInterface> {
  try {
    const database = (await conexion).db("tocgame");
    const movimientos = database.collection<MovimientosInterface>("movimientos");
    return await movimientos.findOne(
      { enviado: false },
      { sort: { _id: 1 } }
    );
  } catch (err) {
    console.log(err);
    return null;
  }
}

/* Eze v23 */
export async function limpiezaMovimientos(): Promise<boolean> {
  try {
    const database = (await conexion).db("tocgame");
    const movimientos = database.collection<MovimientosInterface>("movimientos");
    return (await movimientos.deleteMany({
      enviado: true,
      _id: { $lte: UtilesModule.restarDiasTimestamp(Date.now()) },
    })).acknowledged;
  } catch (err) {
    console.log(err);
    return false;
  }
}

/* Eze v23 */
export async function actualizarEstadoMovimiento(
  movimiento: MovimientosInterface
): Promise<boolean> {
  try {
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
    return (resultado.acknowledged && resultado.modifiedCount > 0);
  } catch (err) {
    console.log(err);
    return false;
  }
}
