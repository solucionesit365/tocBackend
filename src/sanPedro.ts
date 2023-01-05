// import { ticketsInstance } from "./tickets/tickets.clase";
import {
  // sincronizarTickets,
  // sincronizarCajas,
  // sincronizarMovimientos,
  sincronizarFichajes,
  sincronizarDevoluciones,
} from "./sincro";
// import { cajaInstance } from "./caja/caja.clase";
// import { movimientosInstance } from "./movimientos/movimientos.clase";
import { trabajadoresInstance } from "./trabajadores/trabajadores.clase";
import { devolucionesInstance } from "./devoluciones/devoluciones.clase";
import { logger } from "./logger";

let URL_SANPEDRO = "";
if (process.env.npm_lifecycle_event === "start:dev")
  URL_SANPEDRO = "http://localhost:3001";
else URL_SANPEDRO = "https://sanpedro.cloud";
const io = require("socket.io-client");
const socket = io(URL_SANPEDRO);

// const socket = io('http://localhost:3001'); // DEV SANPEDRO EN LOCAL

function emitSocket(canal: string, datos: any = null) {
  if (socket.connected) {
    socket.emit(canal, datos);
  }
}

// socket.on("resSincroTickets", async (data) => {
//   if (data.error == false) {
//     if (data.ticket) {
//       if (await ticketsInstance.actualizarEstadoTicket(data.ticket)) {
//         sincronizarTickets(true);
//       } else {
//         logger.Error(19, "Error al actualizar el ticket");
//       }
//     }
//   } else {
//     if (typeof data.ticket.comentario == "string") {
//       if (data.mensaje == "SanPedro: Error, parámetros incorrectos") {
//         data.ticket.comentario = "SanPedro: Error, parámetros incorrectos";
//       }
//     }
//   }
// });

// socket.on("resCajas", (data) => {
//   if (data.error == false) {
//     if (data.repetir == false) {
//       cajaInstance
//         .confirmarCajaEnviada(data.infoCaja)
//         .then((res) => {
//           if (res) {
//             sincronizarCajas();
//           } else {
//             logger.Error(20, "Error al actualizar el estado de la caja");
//           }
//         })
//         .catch((err) => {
//           logger.Error(21, err);
//         });
//     } else {
//       cajaInstance
//         .confirmarCajaEnviada(data.infoCaja)
//         .then((res) => {
//           if (res) {
//             sincronizarCajas();
//           } else {
//             logger.Error(22, "Error al actualizar el estado de la caja 2");
//           }
//         })
//         .catch((err) => {
//           logger.Error(23, err);
//         });
//       // cambiar estado infoCaja en mongo (enviado + comentario)
//     }
//   } else {
//     logger.Error(24, data.mensaje);
//   }
// });

// socket.on("resMovimientos", (data) => {
//   if (data.error == false) {
//     movimientosInstance
//       .actualizarEstadoMovimiento(data.movimiento)
//       .then((res) => {
//         if (res) {
//           sincronizarMovimientos(true);
//         } else {
//           logger.Error(25, "Error al actualizar el estado del movimiento");
//         }
//       })
//       .catch((err) => {
//         logger.Error(26, err);
//       });
//   } else {
//     logger.Error(27, data.mensaje);
//   }
// });

socket.on("resFichajes", (data) => {
  if (data.error == false) {
    trabajadoresInstance
      .actualizarEstadoFichaje(data.fichaje)
      .then((res) => {
        if (res) {
          sincronizarFichajes();
        } else {
          logger.Error(28, "Error al actualizar el estado del fichaje");
        }
      })
      .catch((err) => {
        logger.Error(29, err);
      });
  } else {
    logger.Error(30, data.mensaje);
  }
});

socket.on("resSincroDevoluciones", (data) => {
  if (!data.error) {
    devolucionesInstance
      .actualizarEstadoDevolucion(data.devolucion)
      .then((res) => {
        if (res) {
          sincronizarDevoluciones();
        } else {
          logger.Error(31, "Error al actualizar el estadio de la devolución.");
        }
      })
      .catch((err) => {
        logger.Error(32, err);
      });
  } else {
    logger.Error(33, data.mensaje);
  }
});

export { socket, emitSocket };
