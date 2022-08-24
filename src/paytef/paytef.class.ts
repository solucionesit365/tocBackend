import axios from "axios";
import { SocketGateway } from "../sockets.gateway";
import { movimientosInstance } from "../movimientos/movimientos.clase";
import { parametrosInstance } from "src/parametros/parametros.clase";
import { trabajadoresInstance } from "src/trabajadores/trabajadores.clase";
import { ticketsInstance } from "src/tickets/tickets.clase";
import { cestas } from "src/cestas/cestas.clase";
import { TicketsInterface } from "src/tickets/tickets.interface";
import { CestasInterface } from "src/cestas/cestas.interface";
import { transaccionesInstance } from "src/transacciones/transacciones.class";
import { nuevoTicket } from "src/tickets/tickets.mongodb";
import { UtilesModule } from "src/utiles/utiles.module";
import { LogsClass } from "src/logs/logs.class";
import { TransaccionesInterface } from "src/transacciones/transacciones.interface";
import { Socket } from "dgram";
import { Respuesta } from "./paytef.interface";

function limpiarNombreTienda(cadena: string) {
  const devolver = Number(cadena.replace(/\D/g, ""));
  if (isNaN(devolver) == false) {
    return devolver;
  } else {
    return 0;
  }
}

class PaytefClass {
  getTotal(cesta: CestasInterface): number {
    let total = 0;
    cesta.lista.forEach((itemLista) => {
      total += itemLista.subtotal;
    });
    return total;
  }

  /* Parámetros de entrada OK */
  async iniciarTransaccion(
    client: Socket,
    idCliente: string,
    idCesta: number
  ): Promise<void> {
    try {
      const idTrabajadorActivo =
        await trabajadoresInstance.getCurrentIdTrabajador();
      if (idTrabajadorActivo != null) {
        const cesta = await cestas.getCestaByID(idCesta);
        if (cesta != null) {
          const total = this.getTotal(cesta);
          if (cesta.lista.length > 0 && total > 0) {
            const nuevoTicket = ticketsInstance.generarObjetoTicket(
              (await ticketsInstance.getUltimoTicket()) + 1,
              total,
              cesta,
              "TARJETA",
              idTrabajadorActivo,
              idCliente
            );
            nuevoTicket.bloqueado = true;
            if (await paytefInstance.cerrarTicket(nuevoTicket)) {
              // Ticket creado
              this.iniciarDatafono(nuevoTicket._id, total, client, cesta._id);
            } else {
              throw Error("Error, no se ha podido cerrar el ticket");
            }
          } else {
            throw Error("Lista vacía o total a 0€");
          }
        } else {
          throw Error("No existe la cesta del trabajador activo");
        }
      } else {
        throw Error("No existe el trabajador activo");
      }
    } catch (err) {
      this.cancelarOperacion();
      client.emit("consultaPaytef", { error: true, mensaje: err.message });
    }
  }

  async cerrarTicket(nuevoTicket: TicketsInterface): Promise<boolean> {
    try {
      if (await ticketsInstance.insertarTicket(nuevoTicket)) {
        if (await parametrosInstance.setUltimoTicket(nuevoTicket._id)) {
          return true;
        }
        this.anularOperacion(nuevoTicket._id, "cerrarTicket()");
        return false;
      }
      return false;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  /* Cancela la operación en el propio datáfono */
  cancelarOperacion() {
    const params = parametrosInstance.getParametros();
    axios.post(`http://${params.ipTefpay}:8887/pinpad/cancel`, { pinpad: "*" });
  }

  /* Anula el ticket creado (por algún error). NO detiene el ciclo (sin respuesta al cliente) */
  anularOperacion(idTicket: number, msj = "") {
    ticketsInstance
      .borrarTicket(idTicket)
      .then((resAnulacion) => {
        if (resAnulacion == false) {
          LogsClass.newLog(
            "Error nuevo grave",
            `Ticket debía ser borrado pero no se ha podido: idTicket: ${idTicket} tiemstamp: ${Date.now()} y viene de ${msj}`
          );
        }
      })
      .catch((err) => {
        console.log(err);
        LogsClass.newLog(
          "Traza paytef",
          `anularOperacion(${idTicket}, client, msj) entra en su catch. timestamp ${Date.now()} y otra vez el idTicket: ${idTicket}`
        );
      });
  }

  async iniciarDatafono(
    idTicket: number,
    total: number,
    client: Socket,
    idCesta: number
  ): Promise<void> {
    try {
      const params = parametrosInstance.getParametros();
      if (UtilesModule.checkVariable(params.ipTefpay)) {
        const respuestaPaytef: any = await axios.post(
          `http://${params.ipTefpay}:8887/transaction/start`,
          {
            pinpad: "*",
            opType: "sale",
            createReceipt: true,
            executeOptions: {
              method: "polling",
            },
            language: "es",
            requestedAmount: Math.round(total * 100),
            requireConfirmation: false,
            transactionReference: idTicket,
            showResultSeconds: 5,
          }
        );
        if (respuestaPaytef.data.info.started) {
          // Arranca el ciclo de comprobaciones
          this.consultarEstadoOperacion(client, idTicket, total, idCesta);
        } else {
          throw Error("La operación no ha podido iniciar");
        }
      } else {
        throw Error("IP TefPay no definida, contacta con informática");
      }
    } catch (err) {
      console.log(err);
      this.cancelarOperacion();
      this.anularOperacion(idTicket, "Backend: " + err.message);
      client.emit("consultaPaytef", {
        error: false,
        mensaje: "Backend: " + err.message,
      });
    }
  }

  /* Función recursiva y asíncrona */
  async consultarEstadoOperacion(
    client: Socket,
    idTicket: number,
    total: number,
    idCesta: number
  ): Promise<void> {
    try {
      const ipDatafono = parametrosInstance.getParametros().ipTefpay;
      const resEstadoPaytef: any = await axios.post(
        `http://${ipDatafono}:8887/transaction/poll`,
        {
          pinpad: "*",
        }
      );

      /* ¿Ya existe el resultado de PayTef? */
      if (UtilesModule.checkVariable(resEstadoPaytef.data.result)) {
        if (resEstadoPaytef.data.result.approved) {
          await ticketsInstance.desbloquearTicket(idTicket);
          await movimientosInstance.nuevaSalida(
            total,
            "Targeta",
            "TARJETA",
            false,
            idTicket
          );
          await cestas.borrarCesta(idCesta);
          client.emit("consultaPaytef", {
            // Operación aprobada. Todo OK
            error: false,
          });
        } else {
          throw Error("Operación denegada por PayTef");
        }
      } else {
        await new Promise((r) => setTimeout(r, 1000));
        this.consultarEstadoOperacion(client, idTicket, total, idCesta);
      }
    } catch (err) {
      this.cancelarOperacion();
      this.anularOperacion(idTicket, err.message);
      LogsClass.newLog(idTicket, err.message);
      client.emit("consultaPaytef", {
        error: true,
        mensaje: "Backend: " + err.message,
      });
    }
  }
}

const paytefInstance = new PaytefClass();
export { paytefInstance };
