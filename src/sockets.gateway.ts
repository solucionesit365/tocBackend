import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { paytefInstance } from "./paytef/paytef.class";
import { Socket } from "dgram";
import { ticketsInstance } from "./tickets/tickets.clase";
import { cestasInstance } from "./cestas/cestas.clase";
import { logger } from "./logger";

@WebSocketGateway(5051, {
  cors: {
    origin: true,
    credentials: true,
    transports: ["websocket"],
  },
  allowEIO3: true,
})
export class SocketGateway {
  @WebSocketServer()
  server: Socket;

  /* Eze 4.0 */
  handleConnection(client: any, ...args: any[]) {
    logger.Info("Nuevo cliente conectado por socket 1");
    console.warn("Nuevo cliente conectado por socket");
  }

  /* Eze 4.0 */
  handleDisconnect() {
    logger.Error("Nuevo cliente conectado por socket 2");
    logger.Error("Se ha desconectado un cliente del socket");
  }

  /* Eze 4.0 */
  @SubscribeMessage("test")
  test(@MessageBody() params, @ConnectedSocket() client: Socket) {
    client.emit("test", "O Rei Ezeee");
  }

  @SubscribeMessage("consultarPuntos")
  consultarPuntos(@MessageBody() params, @ConnectedSocket() client: Socket) {
    if (params != undefined) {
      if (params.idClienteFinal != undefined) {
        client.emit("resConsultaPuntos", { error: false, info: 69 });
      } else {
        client.emit("resConsultaPuntos", {
          error: true,
          mensaje: "Backend: Faltan datos en socket > consultarPuntos",
        });
      }
    } else {
      client.emit("resConsultaPuntos", {
        error: true,
        mensaje: "Backend: Faltan datos en socket > consultarPuntos",
      });
    }
  }

  /* Eze 4.0 */
  @SubscribeMessage("iniciarTransaccion")
  async iniciarPaytef(@MessageBody() { idTrabajador, idCesta, idCliente }, @ConnectedSocket() client: Socket) {
    try {
      if (idTrabajador && idCesta) {
        const cesta = await cestasInstance.getCestaById(idCesta);
        const total = cestasInstance.getTotalCesta(cesta);
        if (total == 0) throw Error("Error, no se puede pagar una compra con importe 0 con datáfono");
        const nuevoTicket = await ticketsInstance.generarNuevoTicket(total, idCesta, idCliente, idTrabajador);
        if (await ticketsInstance.insertarTicket(nuevoTicket)) await paytefInstance.iniciarTransaccion(client, idTrabajador, nuevoTicket._id);
        throw Error("Error, no se ha podido crear el ticket en iniciarTransaccion() socket.gateway");        
      }
      throw Error("Error, faltan datos en iniciarTransaccion() socket.gateway");
    } catch (err) {
      logger.Error(err);
      paytefInstance.cancelarOperacionActual();
      client.emit("consultaPaytef", false);
    }
  }
}
