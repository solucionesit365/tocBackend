import { createServer } from "http";
import { Server } from "socket.io";
import { cajaInstance } from "./caja/caja.clase";
import { cestasInstance } from "./cestas/cestas.clase";
import { logger } from "./logger";
import { movimientosInstance } from "./movimientos/movimientos.clase";
import { parametrosInstance } from "./parametros/parametros.clase";
import { tecladoInstance } from "./teclado/teclado.clase";
import { ticketsInstance } from "./tickets/tickets.clase";
import { trabajadoresInstance } from "./trabajadores/trabajadores.clase";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:8080"
  }
});

io.on("connection", (socket) => {
  console.log("CONECTADO");
  /* Eze 4.0 */
  socket.on("cargarTrabajadores", async (data) => {
    try {
      socket.emit("cargarTrabajadores", await trabajadoresInstance.getTrabajadoresFichados());
    } catch (err) {
      logger.Error(36, err);
    }
  });

  /* Eze 4.0 */
  socket.on("cargarCestas", async (data) => {
    try {
      socket.emit("cargarCestas", await cestasInstance.getAllCestas());
    } catch (err) {
      logger.Error(37, err);
    }
  });

  /* Eze 4.0 */
  socket.on("cargarParametros", async () => {
    try {
      socket.emit("cargarParametros", await parametrosInstance.getParametros());
    } catch (err) {
      logger.Error(38, err);
    }
  });

  /* Eze 4.0 */
  socket.on("cargarVentas", async () => {
    try {
      if (await cajaInstance.cajaAbierta()) {
        // const caja = await cajaInstance.getInfoCajaAbierta();
        socket.emit("cargarVentas", (await movimientosInstance.construirArrayVentas()).reverse());
      }      
    } catch (err) {
      logger.Error(39, err);
    }
  });

  /* Eze 4.0 */
  socket.on("cargarTeclado", async () => {
    try {
      socket.emit("cargarTeclado", await tecladoInstance.generarTecladoCompleto());
    } catch (err) {
      logger.Error(118, err);
    }
  });
});

httpServer.listen(5051);

export { io };