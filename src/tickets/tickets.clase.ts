import { TicketsInterface } from "./tickets.interface";
import * as schTickets from "./tickets.mongodb";
import { trabajadoresInstance } from "../trabajadores/trabajadores.clase";
import { CestaClase, cestas } from "../cestas/cestas.clase";
import { parametrosInstance } from "../parametros/parametros.clase";
import { movimientosInstance } from "../movimientos/movimientos.clase";
import { articulosInstance } from "../articulos/articulos.clase";
import axios from "axios";
import { clienteInstance } from "../clientes/clientes.clase";
import { CestasInterface } from "src/cestas/cestas.interface";

export class TicketsClase {
  /* No válido para clientes especiales que pagan en tienda (infoClienteVip) */
  generarObjetoTicket(
    idTicket: number,
    total: number,
    cesta: CestasInterface,
    tipoPago: string,
    idCurrentTrabajador: number,
    idCliente: string
  ) {
    const nuevoTicket: TicketsInterface = {
      _id: idTicket,
      timestamp: Date.now(),
      total: total,
      lista: cesta.lista,
      tipoPago: tipoPago,
      idTrabajador: idCurrentTrabajador,
      tiposIva: cesta.tiposIva,
      cliente: idCliente,
      infoClienteVip: {
        esVip: false,
        nif: "",
        nombre: "",
        cp: "",
        direccion: "",
        ciudad: "",
      },
      enviado: false,
      enTransito: false,
      intentos: 0,
      comentario: "",
      regalo: cesta.regalo, // (cesta.regalo == true && idCliente != '' && idCliente != null) ? (true): (false),
      recibo: "",
      bloqueado: false,
    };
    return nuevoTicket;
  }

  getTicketByID(idTicket: number): Promise<TicketsInterface> {
    return schTickets
      .getTicketByID(idTicket)
      .then((res: TicketsInterface) => {
        return res;
      })
      .catch((err) => {
        console.log(err);
        return null;
      });
  }

  anularTicket(idTicket, forzar = false) {
    return schTickets.anularTicket(idTicket, forzar).catch((err) => {
      console.log(err);
      return false;
    });
  }

  // anotarAnulado(idTicket: number) {
  //   schTickets.anotarAnulado(idTicket);
  // }

  getTicketsIntervalo(
    fechaInicio: number,
    fechaFinal: number
  ): Promise<TicketsInterface[]> {
    return schTickets
      .getTicketsIntervalo(fechaInicio, fechaFinal)
      .then((resultado: TicketsInterface[]) => {
        return resultado;
      })
      .catch((err) => {
        console.log(err);
        return null;
      });
  }

  getTicketAnulado = async (idTicket: number) => await schTickets.getTicketAnulado(idTicket);

  getUltimoTicket() {
    return parametrosInstance
      .getEspecialParametros()
      .then((res) => {
        if (typeof res.ultimoTicket === "number") {
          return res.ultimoTicket;
        } else {
          return 0;
        }
      })
      .catch((err) => {
        console.log(err.message);
        return 0;
      });
  }

  async insertarTicket(ticket: TicketsInterface): Promise<boolean> {
    try {
      if (ticket.lista.length == 0) {
        throw Error("La cesta no puede estar vacía");
      }
      if (await schTickets.nuevoTicket(ticket)) {
        if (ticket.regalo === true) {
          axios
            .post("clientes/resetPuntosCliente", {
              database: parametrosInstance.getParametros().database,
              idClienteFinal: ticket.cliente,
            })
            .catch((err) => {
              console.log(err);
            });
          articulosInstance.setEstadoTarifaEspecial(false);
          clienteInstance.setEstadoClienteVIP(false);
        }
        return true;
      }
      return false;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async crearTicketEfectivo(total: number, idCesta: number, idCliente: string) {
    const infoTrabajador = await trabajadoresInstance.getCurrentTrabajador();
    const nuevoIdTicket = (await this.getUltimoTicket()) + 1;
    const cesta = await cestas.getCesta(idCesta);

    if (cesta == null || cesta.lista.length == 0) {
      console.log("Error, la cesta es null o está vacía");
      return false;
    }
    for (const key in cesta.lista) {
      const infoArticulo = await articulosInstance.getInfoArticulo(
        cesta.lista[key]._id
      );
      const gramos = cesta.lista[key].subtotal / infoArticulo.precioConIva;
      if (
        infoArticulo.esSumable == false &&
        !cesta.lista[key].suplementosId &&
        cesta.lista[key].unidades == 1 &&
        !cesta.lista[key].promocion.esPromo
      ) {
        cesta.lista[key].unidades = gramos;
      }
    }

    const objTicket: TicketsInterface = {
      _id: nuevoIdTicket,
      timestamp: Date.now(),
      total: total,
      lista: cesta.lista,
      tipoPago: "EFECTIVO",
      idTrabajador: infoTrabajador._id,
      tiposIva: cesta.tiposIva,
      cliente: idCliente != "" && idCliente != null ? idCliente : null,
      infoClienteVip: {
        esVip: false,
        nif: "",
        nombre: "",
        cp: "",
        direccion: "",
        ciudad: "",
      },
      enviado: false,
      enTransito: false,
      intentos: 0,
      comentario: "",
      regalo:
        cesta.regalo == true && idCliente != "" && idCliente != null
          ? true
          : false,
      bloqueado: false,
    };

    if (await this.insertarTicket(objTicket)) {
      if (await cestas.borrarCesta(idCesta)) {
        if (await parametrosInstance.setUltimoTicket(objTicket._id)) {
          return true;
        } else {
          console.log("Error no se ha podido cambiar el último id ticket");
        }
      } else {
        console.log("Error, no se ha podido borrar la cesta");
      }
    } else {
      console.log("Error, no se ha podido insertar el ticket");
    }
    return false;
  }

  async crearTicketDatafono3G(
    total: number,
    idCesta: number,
    idCliente: string
  ) {
    const infoTrabajador = await trabajadoresInstance.getCurrentTrabajador();
    const nuevoIdTicket = (await this.getUltimoTicket()) + 1;
    const cesta = await cestas.getCesta(idCesta);
    if (cesta == null || cesta.lista.length == 0) {
      console.log("Error, la cesta es null o está vacía");
      return false;
    }
    for (const key in cesta.lista) {
      const infoArticulo = await articulosInstance.getInfoArticulo(
        cesta.lista[key]._id
      );
      const gramos = cesta.lista[key].subtotal / infoArticulo.precioConIva;
      if (
        infoArticulo.esSumable == false &&
        !cesta.lista[key].suplementosId &&
        cesta.lista[key].unidades == 1
      ) {
        cesta.lista[key].unidades = gramos;
      }
    }

    const objTicket: TicketsInterface = {
      _id: nuevoIdTicket,
      timestamp: Date.now(),
      total: total,
      lista: cesta.lista,
      tipoPago: "TARJETA",
      idTrabajador: infoTrabajador._id,
      tiposIva: cesta.tiposIva,
      cliente: idCliente != "" && idCliente != null ? idCliente : null,
      infoClienteVip: {
        esVip: false,
        nif: "",
        nombre: "",
        cp: "",
        direccion: "",
        ciudad: "",
      },
      enviado: false,
      enTransito: false,
      intentos: 0,
      comentario: "",
      regalo:
        cesta.regalo == true && idCliente != "" && idCliente != null
          ? true
          : false,
      bloqueado: false,
    };

    if (await this.insertarTicket(objTicket)) {
      if (await cestas.borrarCesta(idCesta)) {
        if (await parametrosInstance.setUltimoTicket(objTicket._id)) {
          movimientosInstance.nuevaSalida(
            objTicket.total,
            "Targeta 3G",
            "TARJETA",
            false,
            objTicket._id
          );
          return true;
        } else {
          console.log("Error no se ha podido cambiar el último id ticket");
        }
      } else {
        console.log("Error, no se ha podido borrar la cesta");
      }
    } else {
      console.log("Error, no se ha podido insertar el ticket");
    }
    return false;
  }

  async crearTicketTKRS(
    total: number,
    totalTkrs: number,
    idCesta: number,
    idCliente: string
  ) {
    const infoTrabajador = await trabajadoresInstance.getCurrentTrabajador();
    const nuevoIdTicket = (await this.getUltimoTicket()) + 1;
    const cesta = await cestas.getCesta(idCesta);

    if (cesta == null || cesta.lista.length == 0) {
      console.log("Error, la cesta es null o está vacía");
      return false;
    }
    for (const key in cesta.lista) {
      const infoArticulo = await articulosInstance.getInfoArticulo(
        cesta.lista[key]._id
      );
      const gramos = cesta.lista[key].subtotal / infoArticulo.precioConIva;
      if (
        infoArticulo.esSumable == false &&
        !cesta.lista[key].suplementosId &&
        cesta.lista[key].unidades == 1
      ) {
        cesta.lista[key].unidades = gramos;
      }
    }

    const objTicket: TicketsInterface = {
      _id: nuevoIdTicket,
      timestamp: Date.now(),
      total: total,
      lista: cesta.lista,
      tipoPago: "TKRS",
      idTrabajador: infoTrabajador._id,
      tiposIva: cesta.tiposIva,
      cliente: idCliente != "" && idCliente != null ? idCliente : null,
      infoClienteVip: {
        esVip: false,
        nif: "",
        nombre: "",
        cp: "",
        direccion: "",
        ciudad: "",
      },
      enviado: false,
      enTransito: false,
      intentos: 0,
      comentario: "",
      regalo:
        cesta.regalo == true && idCliente != "" && idCliente != null
          ? true
          : false,
      bloqueado: false,
    };

    if (await this.insertarTicket(objTicket)) {
      if (await cestas.borrarCesta(idCesta)) {
        if (await parametrosInstance.setUltimoTicket(objTicket._id)) {
          objTicket["cantidadTkrs"] = totalTkrs;
          const diferencia = total - totalTkrs;
          if (diferencia >= 0) {
            return movimientosInstance
              .nuevaSalida(
                objTicket.total,
                `Pagat TkRs (TkRs): ${objTicket._id}`,
                "TKRS_SIN_EXCESO",
                false,
                objTicket._id
              )
              .then((salida0) => {
                return salida0;
              })
              .catch((err) => {
                console.log(err);
                return false;
              });
          } else {
            return movimientosInstance
              .nuevaSalida(
                Number((diferencia * -1).toFixed(2)),
                `Pagat TkRs (TkRs): ${objTicket._id}`,
                "TKRS_CON_EXCESO",
                false,
                objTicket._id
              )
              .then((salida1) => {
                if (salida1) {
                  return movimientosInstance
                    .nuevaSalida(
                      objTicket.total,
                      `Pagat TkRs (TkRs): ${objTicket._id}`,
                      "TKRS_SIN_EXCESO",
                      false,
                      objTicket._id
                    )
                    .then((salida2) => {
                      return salida2;
                    })
                    .catch((err) => {
                      console.log(err);
                      return false;
                    });
                } else {
                  return false;
                }
              })
              .catch((err) => {
                console.log(err);
                return false;
              });
          }
        } else {
          console.log("Error no se ha podido cambiar el último id ticket");
        }
      } else {
        console.log("Error, no se ha podido borrar la cesta");
      }
    } else {
      console.log("Error, no se ha podido insertar el ticket");
    }
    return false;
  }

  async crearTicketDeuda(
    total: number,
    idCesta: number,
    idCliente: string,
    infoClienteVip: any
  ) {
    const infoTrabajador = await trabajadoresInstance.getCurrentTrabajador();
    const nuevoIdTicket = (await this.getUltimoTicket()) + 1;
    const cesta = await cestas.getCesta(idCesta);

    if (cesta == null || cesta.lista.length == 0) {
      console.log("Error, la cesta es null o está vacía");
      return false;
    }
    for (const key in cesta.lista) {
      const infoArticulo = await articulosInstance.getInfoArticulo(
        cesta.lista[key]._id
      );
      const gramos = cesta.lista[key].subtotal / infoArticulo.precioConIva;
      if (
        infoArticulo.esSumable == false &&
        !cesta.lista[key].suplementosId &&
        cesta.lista[key].unidades == 1
      ) {
        cesta.lista[key].unidades = gramos;
      }
    }

    const objTicket: TicketsInterface = {
      _id: nuevoIdTicket,
      timestamp: Date.now(),
      total: total,
      lista: cesta.lista,
      tipoPago: "DEUDA",
      idTrabajador: infoTrabajador._id,
      tiposIva: cesta.tiposIva,
      cliente: idCliente != "" && idCliente != null ? idCliente : null, // Es clienteFinal
      infoClienteVip: {
        esVip: infoClienteVip.esVip,
        nif: infoClienteVip.nif,
        nombre: infoClienteVip.nombre,
        cp: infoClienteVip.cp,
        direccion: infoClienteVip.direccion,
        ciudad: infoClienteVip.ciudad,
      },
      enTransito: false,
      enviado: false,
      intentos: 0,
      comentario: "",
      bloqueado: false,
    };

    if (await this.insertarTicket(objTicket)) {
      if (await cestas.borrarCesta(idCesta)) {
        if (await parametrosInstance.setUltimoTicket(objTicket._id)) {
          movimientosInstance.nuevaSalida(
            objTicket.total,
            `Deute client: ${objTicket._id}`,
            "DEUDA",
            false,
            objTicket._id
          );
          return true;
        } else {
          console.log("Error no se ha podido cambiar el último id ticket");
        }
      } else {
        console.log("Error, no se ha podido borrar la cesta");
      }
    } else {
      console.log("Error, no se ha podido insertar el ticket");
    }
    return false;
  }

  async crearTicketConsumoPersonal(idCesta: number) {
    const infoTrabajador = await trabajadoresInstance.getCurrentTrabajador();
    const nuevoIdTicket = (await this.getUltimoTicket()) + 1;
    const cesta = await cestas.getCesta(idCesta);

    if (cesta == null || cesta.lista.length == 0) {
      console.log("Error, la cesta es null o está vacía");
      return false;
    }
    for (const key in cesta.lista) {
      const infoArticulo = await articulosInstance.getInfoArticulo(
        cesta.lista[key]._id
      );
      const gramos = cesta.lista[key].subtotal / infoArticulo.precioConIva;
      if (
        infoArticulo.esSumable == false &&
        !cesta.lista[key].suplementosId &&
        cesta.lista[key].unidades == 1
      ) {
        cesta.lista[key].unidades = gramos;
      }
    }

    const objTicket: TicketsInterface = {
      _id: nuevoIdTicket,
      timestamp: Date.now(),
      total: 0,
      lista: cesta.lista,
      tipoPago: "CONSUMO_PERSONAL",
      idTrabajador: infoTrabajador._id,
      tiposIva: cesta.tiposIva,
      cliente: null,
      infoClienteVip: {
        esVip: false,
        nif: "",
        nombre: "",
        cp: "",
        direccion: "",
        ciudad: "",
      },
      enTransito: false,
      enviado: false,
      intentos: 0,
      comentario: "",
      bloqueado: false,
    };

    if (await this.insertarTicket(objTicket)) {
      if (await cestas.borrarCesta(idCesta)) {
        if (await parametrosInstance.setUltimoTicket(objTicket._id)) {
          return true;
        } else {
          console.log("Error no se ha podido cambiar el último id ticket");
        }
      } else {
        console.log("Error, no se ha podido borrar la cesta");
      }
    } else {
      console.log("Error, no se ha podido insertar el ticket");
    }
    return false;
  }

  getTicketMasAntiguo(): Promise<TicketsInterface> {
    return schTickets.getTicketMasAntiguo().catch((err) => {
      console.log(err);
      return null;
    });
  }

  actualizarEstadoTicket(ticket: TicketsInterface) {
    return schTickets
      .actualizarEstadoTicket(ticket)
      .then((res) => {
        return res.acknowledged;
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  }

  actualizarComentario(ticket: TicketsInterface) {
    return schTickets
      .actualizarComentario(ticket)
      .then((res) => {
        return res.acknowledged;
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  }

  /* Eze v.recortada */
  async getTicketsTarjeta() {
    const fecha = new Date();
    fecha.setHours(0, 0, 0, 0);
    const inicioTime = fecha.valueOf();
    return await schTickets.getTicketsTarjeta(inicioTime, Date.now());
  }

  // desbloquearTicket(idTicket: number) {
  //   return schTickets.desbloquearTicket(idTicket).catch((err) => {
  //     console.log(err);
  //     return false;
  //   });
  // }

  borrarTicket(idTicket: number): Promise<boolean> {
    return schTickets.borrarTicket(idTicket);
  }
}

export const ticketsInstance = new TicketsClase();
