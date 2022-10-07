import { createServer } from "http";
import { Server } from "socket.io";
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
      console.log(data);
      socket.emit("cargarTrabajadores", 456789);
    } catch (err) {
      logger.Error(err);
      console.log(err);
    }
  });
});



httpServer.listen(5051);
io.emit("cargarTrabajadores", "putaqtepario")
export { io };