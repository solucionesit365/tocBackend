import { TicketsInterface, TiposPago } from "./tickets.interface";
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
    tipoPago: TiposPago,
    idCurrentTrabajador: number,
    idCliente: string,
    infoVip: any = null
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
      infoClienteVip: infoVip,
      enviado: false,
      regalo: cesta.regalo,
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

  anularTicket(idTicket) {
    return schTickets.anularTicket(idTicket).catch((err) => {
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

  /* Eze v23 */
  async getUltimoTicket(): Promise<number | null> {
    return (await parametrosInstance.getParametros()).ultimoTicket;
  }

  async getProximoId(): Promise<number> {
    const ultimoIdTicket = await this.getUltimoTicket();
    if (typeof ultimoIdTicket === "number" && ultimoIdTicket != 0)
      return ultimoIdTicket+1;

    throw Error("El ultimoIdTicket no es correcto");
  }

  /* Eze v23 */
  async insertarTicket(ticket: TicketsInterface): Promise<boolean> {
    try {
      if (ticket.lista.length == 0) {
        throw Error("Error al insertar ticket: la lista está vacía");
      }

      if (await schTickets.nuevoTicket(ticket)) {
        if (ticket.regalo == true) {
          await axios.post("clientes/resetPuntosCliente", {
            database: parametrosInstance.getParametros().database,
            idClienteFinal: ticket.cliente,
          });
        }
        articulosInstance.setEstadoTarifaEspecial(false);
        clienteInstance.setEstadoClienteVIP(false);
        return true;
      }
      return false;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  /* Eze v23 */
  async crearTicketEfectivo(
    total: number,
    idCesta: number,
    idCliente: string,
    idTrabajador: number
  ): Promise<boolean> {
    try {
      const nuevoIdTicket: number = await this.getProximoId();
      const cesta = await cestas.getCesta(idCesta);

      if (cesta == null || cesta.lista.length == 0) {
        throw Error("Error, la cesta es null o está vacía");
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

      const objTicket = this.generarObjetoTicket(
        nuevoIdTicket,
        total,
        cesta,
        "EFECTIVO",
        idTrabajador,
        idCliente
      );

      if (await this.insertarTicket(objTicket)) {
        if (await cestas.borrarCesta(idCesta)) {
          return await parametrosInstance.setUltimoTicket(objTicket._id);
        } else {
          throw Error("Error, no se ha podido borrar la cesta");
        }
      } else {
        throw Error("Error, no se ha podido insertar el ticket");
      }
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  /*  */
  async crearTicketDatafono3G(
    total: number,
    idCesta: number,
    idCliente: string,
    idTrabajador: number
  ): Promise<boolean> {
    try {
      const nuevoIdTicket: number = await this.getProximoId();
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

      const objTicket = this.generarObjetoTicket(
        nuevoIdTicket,
        total,
        cesta,
        "TARJETA",
        idTrabajador,
        idCliente
      );

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
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async crearTicketTKRS(
    total: number,
    totalTkrs: number,
    idCesta: number,
    idCliente: string,
    idTrabajador: number
  ) {
    const nuevoIdTicket: number = await this.getProximoId();
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

    const objTicket = this.generarObjetoTicket(
      nuevoIdTicket,
      total,
      cesta,
      "TKRS",
      idTrabajador,
      idCliente
    );

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
    infoClienteVip: any,
    idTrabajador: number
  ) {
    const nuevoIdTicket: number = await this.getProximoId();
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

    const infoVip = {
      esVip: infoClienteVip.esVip,
      nif: infoClienteVip.nif,
      nombre: infoClienteVip.nombre,
      cp: infoClienteVip.cp,
      direccion: infoClienteVip.direccion,
      ciudad: infoClienteVip.ciudad,
    };

    const objTicket = this.generarObjetoTicket(
      nuevoIdTicket,
      total,
      cesta,
      "DEUDA",
      idTrabajador,
      idCliente,
      infoVip
    );

    if (await this.insertarTicket(objTicket)) {
      if (await cestas.borrarCesta(idCesta)) {
        if (await parametrosInstance.setUltimoTicket(objTicket._id)) {
          return await movimientosInstance.nuevaSalida(
            objTicket.total,
            `Deute client: ${objTicket._id}`,
            "DEUDA",
            false,
            objTicket._id
          );
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

  /* Eze v23 */
  async crearTicketConsumoPersonal(idCesta: number, idTrabajador: number) {
    try {
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

      const objTicket = this.generarObjetoTicket(
        nuevoIdTicket,
        0,
        cesta,
        "CONSUMO_PERSONAL",
        idTrabajador,
        null
      );

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
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  /* Eze v23 */
  getTicketMasAntiguo(): Promise<TicketsInterface> {
    return schTickets.getTicketMasAntiguo();
  }

  /* Eze v23 */
  actualizarEstadoTicket(ticket: TicketsInterface): Promise<boolean> {
    return schTickets.actualizarEstadoTicket(ticket);
  }

  /* Eze v23 */
  desbloquearTicket(idTicket: number): Promise<boolean> {
    return schTickets.desbloquearTicket(idTicket);
  }

  /* Eze v23 */
  borrarTicket(idTicket: number): Promise<boolean> {
    return schTickets.borrarTicket(idTicket);
  }
}

export const ticketsInstance = new TicketsClase();
