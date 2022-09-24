import { Iva, TicketsInterface } from "./tickets.interface";
import * as schTickets from "./tickets.mongodb";
import { trabajadoresInstance } from "../trabajadores/trabajadores.clase";
import { CestaClase, cestas } from "../cestas/cestas.clase";
import { parametrosInstance } from "../parametros/parametros.clase";
import { movimientosInstance } from "../movimientos/movimientos.clase";
import { articulosInstance } from "../articulos/articulos.clase";
import axios from "axios";
import { clienteInstance } from "../clientes/clientes.clase";
import { CestasInterface } from "../cestas/cestas.interface";
import { construirObjetoIvas } from "../funciones/funciones";

export class TicketsClase {
  /* Eze v23 */
  generarObjetoTicket(
    idTicket: number,
    total: number,
    cesta: CestasInterface,
    idCurrentTrabajador: number,
    idCliente: string,
    infoVip: any = null
  ) {
    const nuevoTicket: TicketsInterface = {
      _id: idTicket,
      timestamp: Date.now(),
      total: total,
      lista: cesta.lista,
      idTrabajador: idCurrentTrabajador,
      objIva: cesta.tiposIva,
      cliente: idCliente,
      infoClienteVip: infoVip,
      enviado: false,
      regalo: cesta.regalo,
    };
    return nuevoTicket;
  }

  /* Eze v23 */
  async getTicketByID(idTicket: number): Promise<TicketsInterface> {
    return await schTickets.getTicketByID(idTicket);
  }

  /* Eze v23 */
  async anularTicket(idTicket: number): Promise<boolean> {
    return await schTickets.anularTicket(idTicket);
  }

  /* Eze v24 */
  async getTicketsIntervalo(
    fechaInicio: number,
    fechaFinal: number
  ): Promise<TicketsInterface[]> {
    const arrayTickets = await schTickets.getTicketsIntervalo(
      fechaInicio,
      fechaFinal
    );
    if (arrayTickets.length > 0) return arrayTickets;

    throw Error("Error: No hay tickets en este intervalo");
  }

  /* Eze v23 */
  async getUltimoTicket(): Promise<number | null> {
    return (await parametrosInstance.getParametros()).ultimoTicket;
  }

  /* Eze v23 */
  async getProximoId(): Promise<number> {
    const ultimoIdTicket = await this.getUltimoTicket();
    if (typeof ultimoIdTicket === "number" && ultimoIdTicket != 0)
      return ultimoIdTicket + 1;

    throw Error("El ultimoIdTicket no es correcto");
  }

  /* Eze v23 */
  async insertarTicket(ticket: TicketsInterface): Promise<boolean> {
    try {
      if (ticket.lista.length == 0)
        throw Error("Error al insertar ticket: la lista está vacía");

      if (await schTickets.nuevoTicket(ticket)) {
        if (ticket.regalo == true) {
          axios.post("clientes/resetPuntosCliente", {
            database: (await parametrosInstance.getParametros()).database,
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

      if (cesta == null || cesta.lista.length == 0)
        throw Error("Error, la cesta es null o está vacía");

      /* Código Santi o Fran */
      for (const key in cesta.lista) {
        const infoArticulo = await articulosInstance.getInfoArticulo(
          cesta.lista[key]._id
        );
        const gramos = cesta.lista[key].subtotal / infoArticulo.precioConIva;
        if (
          infoArticulo.esSumable == false &&
          !cesta.lista[key].suplementosId &&
          cesta.lista[key].unidades == 1 &&
          !cesta.lista[key].esPromo
        ) {
          cesta.lista[key].unidades = gramos;
        }
      }
      /* Final Código Santi o Fran */

      const objTicket = this.generarObjetoTicket(
        nuevoIdTicket,
        total,
        cesta,
        idTrabajador,
        idCliente
      );

      if (await this.insertarTicket(objTicket)) {
        if (await cestas.deleteCesta(idCesta)) {
          return await parametrosInstance.setUltimoTicket(objTicket._id);
        }
      }
      return false;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  /* Eze v23 */
  async crearTicketDatafono3G(
    total: number,
    idCesta: number,
    idCliente: string,
    idTrabajador: number
  ): Promise<boolean> {
    try {
      const nuevoIdTicket: number = await this.getProximoId();
      const cesta = await cestas.getCesta(idCesta);
      if (cesta == null || cesta.lista.length == 0)
        throw Error("Error, la cesta es null o está vacía");

      /* Código Santi o Fran */
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
      /* Final Código Santi o Fran */

      const objTicket = this.generarObjetoTicket(
        nuevoIdTicket,
        total,
        cesta,
        idTrabajador,
        idCliente
      );

      if (await this.insertarTicket(objTicket)) {
        if (await cestas.deleteCesta(idCesta)) {
          if (await parametrosInstance.setUltimoTicket(objTicket._id)) {
            return await movimientosInstance.nuevoMovimiento(
              objTicket.total,
              "Targeta 3G",
              "TARJETA",
              objTicket._id,
              idTrabajador
            );
          }
        }
      }
      return false;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  /* Eze v23 */
  async crearTicketTKRS(
    total: number,
    totalTkrs: number,
    idCesta: number,
    idCliente: string,
    idTrabajador: number
  ): Promise<boolean> {
    try {
      const nuevoIdTicket: number = await this.getProximoId();
      const cesta = await cestas.getCesta(idCesta);

      if (cesta == null || cesta.lista.length == 0)
        throw Error("Error, la cesta es null o está vacía");

      /* Código Santi o Fran */
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
      /* Final Código Santi o Fran */

      const objTicket = this.generarObjetoTicket(
        nuevoIdTicket,
        total,
        cesta,
        idTrabajador,
        idCliente
      );

      if (await this.insertarTicket(objTicket)) {
        if (await cestas.deleteCesta(idCesta)) {
          if (await parametrosInstance.setUltimoTicket(objTicket._id)) {
            objTicket["cantidadTkrs"] = totalTkrs;
            const diferencia = total - totalTkrs;
            if (diferencia >= 0) {
              return await movimientosInstance.nuevoMovimiento(
                objTicket.total,
                `Pagat TkRs (TkRs): ${objTicket._id}`,
                "TKRS_SIN_EXCESO",
                objTicket._id,
                idTrabajador
              );
            } else {
              // Aquí hace dos salidas
              const salida1 = await movimientosInstance.nuevoMovimiento(
                Number((diferencia * -1).toFixed(2)),
                `Pagat TkRs (TkRs): ${objTicket._id}`,
                "TKRS_CON_EXCESO",
                objTicket._id,
                idTrabajador
              );

              if (salida1) {
                return await movimientosInstance.nuevoMovimiento(
                  objTicket.total,
                  `Pagat TkRs (TkRs): ${objTicket._id}`,
                  "TKRS_SIN_EXCESO",
                  objTicket._id,
                  idTrabajador
                );
              }
            }
          }
        }
      }
      return false;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  /* Eze v23 */
  async crearTicketDeuda(
    total: number,
    idCesta: number,
    idCliente: string,
    infoClienteVip: any,
    idTrabajador: number
  ): Promise<boolean> {
    try {
      const nuevoIdTicket: number = await this.getProximoId();
      const cesta = await cestas.getCesta(idCesta);

      if (cesta == null || cesta.lista.length == 0)
        throw Error("Error, la cesta es null o está vacía");

      /* Código Santi o Fran */
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
      /* Fin Código Santi o Fran */

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
        idTrabajador,
        idCliente,
        infoVip
      );

      if (await this.insertarTicket(objTicket)) {
        if (await cestas.deleteCesta(idCesta)) {
          if (await parametrosInstance.setUltimoTicket(objTicket._id)) {
            return await movimientosInstance.nuevoMovimiento(
              objTicket.total,
              `Deute client: ${objTicket._id}`,
              "DEUDA",
              objTicket._id,
              idTrabajador
            );
          } else {
            throw Error("Error no se ha podido cambiar el último id ticket");
          }
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

  /* Eze v23 */
  async crearTicketConsumoPersonal(
    idCesta: number,
    idTrabajador: number
  ): Promise<boolean> {
    try {
      const nuevoIdTicket = await this.getProximoId();
      const cesta = await cestas.getCesta(idCesta);

      if (cesta == null || cesta.lista.length == 0)
        throw Error("Error, la cesta es null o está vacía");

      /* Codigo Santi o Fran */
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
      /* Fin Codigo Santi o Fran */

      const objTicket = this.generarObjetoTicket(
        nuevoIdTicket,
        0,
        cesta,
        idTrabajador,
        null
      );

      if (await this.insertarTicket(objTicket)) {
        if (await cestas.deleteCesta(idCesta)) {
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

  /* Eze v23 */
  generarObjetoIva(): Iva {
    return {
      base1: 0,
      base2: 0,
      base3: 0,
      importe1: 0,
      importe2: 0,
      importe3: 0,
      valorIva1: 0,
      valorIva2: 0,
      valorIva3: 0,
    };
  }

  /* Nueva función Eze v23 */
  async calcularIvaTicket(cesta: CestasInterface) {
    let objetoIva: Iva = this.generarObjetoIva();

    for (let i = 0; i < cesta.lista.length; i++) {
      if (!cesta.lista[i].seRegala) {
        if (cesta.lista[i].esPromo) {
          if (cesta.lista[i].promocion.tipoPromo === "COMBO") {
            const articuloPrincipal = await articulosInstance.getInfoArticulo(
              cesta.lista[i].promocion.idPrincipal
            );
            const articuloSecundario = await articulosInstance.getInfoArticulo(
              cesta.lista[i].promocion.idSecundario
            );
            objetoIva = construirObjetoIvas(
              cesta.lista[i].promocion.precioRealPrincipal,
              articuloPrincipal.tipoIva,
              cesta.lista[i].promocion.cantidadPrincipal *
                cesta.lista[i].unidades,
              objetoIva
            );
            objetoIva = construirObjetoIvas(
              cesta.lista[i].promocion.precioRealSecundario,
              articuloSecundario.tipoIva,
              cesta.lista[i].promocion.cantidadSecundario *
                cesta.lista[i].unidades,
              objetoIva
            );
          } else if (cesta.lista[i].promocion.tipoPromo === "INDIVIDUAL") {
            const articuloIndividual = await articulosInstance.getInfoArticulo(
              cesta.lista[i].promocion.idPrincipal
            );
            objetoIva = construirObjetoIvas(
              cesta.lista[i].promocion.precioRealPrincipal,
              articuloIndividual.tipoIva,
              cesta.lista[i].unidades,
              objetoIva
            );
          } else {
            throw Error("Error: El tipo de oferta no es correcto");
          }
        } else {
          const infoArticulo = cesta.lista[i].infoArticulo;
          if (cesta.lista[i].infoArticulo.precioPesaje) {
            // Significa que es a peso
            objetoIva = construirObjetoIvas(
              infoArticulo.precioConIva,
              infoArticulo.tipoIva,
              cesta.lista[i].unidades,
              objetoIva,
              infoArticulo.precioPesaje
            );
          } else {
            objetoIva = construirObjetoIvas(
              infoArticulo.precioConIva,
              infoArticulo.tipoIva,
              cesta.lista[i].unidades,
              objetoIva
            );
          }
        }
      }
    }
  }
}

export const ticketsInstance = new TicketsClase();
