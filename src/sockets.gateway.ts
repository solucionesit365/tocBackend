import { createServer } from "http";
import { Server } from "socket.io";
import { cestasInstance } from "./cestas/cestas.clase";
import { logger } from "./logger";
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
      logger.Error(err);
      console.log(err);
    }
  });

  /* Eze 4.0 */
  socket.on("cargarCestas", async (data) => {
    try {
      socket.emit("cargarCestas", await cestasInstance.getAllCestas());
    } catch (err) {
      logger.Error(err);
      console.log(err);
    }
  });
});

httpServer.listen(5051);

export { io };