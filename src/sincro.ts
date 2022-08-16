import {ticketsInstance} from './tickets/tickets.clase';
import {socket, emitSocket} from './sanPedro';
import {parametrosInstance} from './parametros/parametros.clase';
import {cajaInstance} from './caja/caja.clase';
import {movimientosInstance} from './movimientos/movimientos.clase';
import {trabajadoresInstance} from './trabajadores/trabajadores.clase';
import {devolucionesInstance} from './devoluciones/devoluciones.clase';
import {tecladoInstance} from './teclado/teclado.clase';
import {limpiezaTickets} from './tickets/tickets.mongodb';
import {limpiezaFichajes} from './trabajadores/trabajadores.mongodb';
import {limpiezaCajas} from './caja/caja.mongodb';
import {limpiezaMovimientos} from './movimientos/movimientos.mongodb';

let enProcesoTickets = false;
let enProcesoMovimientos = false;

async function sincronizarTickets(continuar: boolean = false) {
  try {
    if (!enProcesoTickets || continuar) {
      enProcesoTickets = true;
      const parametros = await parametrosInstance.getEspecialParametros();
      if (parametros != null) {
        const ticket = await ticketsInstance.getTicketMasAntiguo();
        if (ticket) {
          if (!Boolean(ticket.bloqueado) === true) {
            emitSocket("sincroTicketsNueva", {
              parametros,
              arrayTickets: ticket,
            });
            return true;
          }
        }
      } else {
        console.log("No hay parámetros definidos en la BBDD");
      }
    }
    enProcesoTickets = false;
    return false;
  } catch (err) {
    enProcesoTickets = false;
    console.log(err);
  }
}

function sincronizarCajas() {
  parametrosInstance.getEspecialParametros().then((parametros) => {
    if (parametros != null) {
      cajaInstance.getCajaMasAntigua().then((res) => {
        if (res.length > 0) {
          emitSocket('sincroCajas', {
            parametros,
            infoCaja: res[0],
          });

          // socket.emit('sincroCajas', {
          //     parametros,
          //     infoCaja: res[0]
          // });
        }
      }).catch((err) => {
        console.log(err);
      });
    } else {
      console.log('No hay parámetros definidos en la BBDD');
    }
  }).catch((err) => {
    console.log(err);
  });
}

async function sincronizarMovimientos(continuar: boolean = false) {
  try {
    if (!enProcesoMovimientos || continuar) {
      enProcesoMovimientos = true;
      const parametros = await parametrosInstance.getEspecialParametros();
      if (parametros != null) {
        const res = await movimientosInstance.getMovimientoMasAntiguo();
        if (res != null) {
          emitSocket("sincroMovimientos", {
            parametros,
            movimiento: res,
          });
          return true;
        }
      } else {
        console.log('No hay parámetros definidos en la BBDD');
      }
    }
    enProcesoMovimientos = false;
  } catch (err) {
    enProcesoMovimientos = false;
    console.log(err);
  }
}

function sincronizarFichajes() {
  parametrosInstance.getEspecialParametros().then((parametros) => {
    if (parametros != null) {
      trabajadoresInstance.getFichajeMasAntiguo().then((res) => {
        if (res != null) {
          emitSocket('sincroFichajes', {
            parametros,
            fichaje: res,
          });

          // socket.emit('sincroFichajes', {
          //     parametros,
          //     fichaje: res
          // });
        }
      }).catch((err) => {
        console.log(err);
      });
    } else {
      console.log('No hay parámetros definidos en la BBDD');
    }
  }).catch((err) => {
    console.log(err);
  });
}

function sincronizarDevoluciones() {
  parametrosInstance.getEspecialParametros().then((parametros) => {
    if (parametros !== null) {
      devolucionesInstance.getDevolucionMasAntigua().then((res) => {
        if (res !== null) {
          emitSocket('sincroDevoluciones', {
            parametros,
            devolucion: res,
          });

          // socket.emit('sincroDevoluciones', {
          //     parametros,
          //     devolucion: res,
          // })
        }
      }).catch((err) => {
        console.log(err);
      });
    } else {
      console.log('No hay parámetros definidos en la BBDD');
    }
  }).catch((err) => {
    console.log(err);
  });
}

/* Actualiza precios, teclado y promociones (es decir, todo) */
function actualizarTeclados() {
  tecladoInstance.actualizarTeclado().catch((err) => {
    console.log(err);
  });
}

// Borrar datos de más de 15 días y que estén enviados.
function limpiezaProfunda(): void {
  limpiezaTickets();
  limpiezaFichajes();
  limpiezaCajas();
  limpiezaMovimientos();
}

setInterval(sincronizarTickets, 8000);
setInterval(sincronizarCajas, 40000);
setInterval(sincronizarMovimientos, 50000);
setInterval(sincronizarFichajes, 20000);
setInterval(sincronizarDevoluciones, 60000);
setInterval(actualizarTeclados, 3600000);
setInterval(limpiezaProfunda, 60000);
export {sincronizarTickets, sincronizarCajas, sincronizarMovimientos, sincronizarFichajes, sincronizarDevoluciones};
