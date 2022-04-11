// 100%
import * as schCestas from './cestas.mongodb';
import { CestasInterface } from './cestas.interface';
import { construirObjetoIvas, crearCestaVacia } from '../funciones/funciones';
import { articulosInstance } from '../articulos/articulos.clase';
import { ofertas } from '../promociones/promociones.clase';
import { cajaInstance } from '../caja/caja.clase';
import { clienteInstance } from '../clientes/clientes.clase';
import { impresoraInstance } from '../impresora/impresora.class';
import { trabajadoresInstance } from '../trabajadores/trabajadores.clase';
import axios from "axios";
import { parametrosInstance } from '../parametros/parametros.clase';

/* Siempre cargar la cesta desde MongoDB */
export class CestaClase {
  private cesta: CestasInterface;
  private udsAplicar: number;
  constructor() {
    /* CARGA DESDE MONGO UNA CESTA EN MEMORIA DE NODE */
    schCestas.getUnaCesta().then((respuesta: CestasInterface) => {
      if (respuesta != undefined && respuesta != null && respuesta.lista.length != 0 && respuesta._id != null) {
      for (let i = 0; i < respuesta.lista.length; i++) {
        respuesta.lista[i].subtotal = Number(respuesta.lista[i].subtotal.toFixed(2));
      }
      this.cesta = respuesta;
    } else {
        this.cesta = crearCestaVacia();
      }
    });
    this.udsAplicar = 1;
  }

  async updateIdCestaTrabajador(id: string) {
    return schCestas.updateIdCestaTrabajador(id).then((res) => {
      return res.acknowledged;
    }).catch((err) => {
      console.log(err);
      return false;
    })
  }

  getCesta(idCesta: number): Promise<CestasInterface> {
    return schCestas.getCestaConcreta(idCesta);
  }

  getCestaRandom(): Promise<CestasInterface> {
    return schCestas.getUnaCesta().then((cesta) => {
      if (cesta != null) {
        return cesta
      } else {
        // No hay ninguna cesta. Crear una.
        const nueva = this.nuevaCestaVacia();
        return this.setCesta(nueva).then((resultado) => {
          if (resultado) {
            return nueva;
          } else {
            throw "Error al crear nueva cesta vacía (por que no hay ninguna)";
          }
        }).catch((err) => {
          throw err;
        });
      }
    }).catch((err) => {
      console.log(err);
      return null;
    });
  }

  // getCurrentId() {
  //   return this.cesta._id;
  // }

  reiniciarCesta(idCestaBorrar) {
    return this.borrarCesta(idCestaBorrar).then(() => {
      return this.getTodasCestas().then((res) => {
        if(res.length > 0) { // Hay alguna cesta
          return res[0]; //Devuelvo la primera que encuentro.
        } else { // No quedan cestas
          const nuevaCesta = this.nuevaCestaVacia();
          this.setCesta(nuevaCesta);
          return nuevaCesta;
        }
      });
    });
  }

  /* La cesta activa es la del trabajador activo */
  borrarCestaActiva() {
    return parametrosInstance.getEspecialParametros().then((parametros) => {
      return schCestas.eliminarCestaByIdTrabajador(parametros.idCurrentTrabajador).then((res) => {
        return res.acknowledged;
      }).catch((err) => {
        console.log(err.message);
        return false;
      });
    });
  }

  nuevaCestaVacia() {
    const nuevaCesta: CestasInterface = {
        _id: Date.now(),
        tiposIva: {
            base1: 0,
            base2: 0,
            base3: 0,
            valorIva1: 0,
            valorIva2: 0,
            valorIva3: 0,
            importe1: 0,
            importe2: 0,
            importe3: 0
        },
        lista: [],
        nombreCesta: 'PRINCIPAL',
        idTrabajador: parametrosInstance.getParametros().idCurrentTrabajador
    };
    return nuevaCesta;
  }

  getTodasCestas(): Promise<CestasInterface[]> {
    return schCestas.getAllCestas();
  }

  borrarCesta(idCestaBorrar): Promise<boolean> {
    return schCestas.borrarCesta(idCestaBorrar).then((res) => {
      return res.acknowledged;
    }).catch((err) => {
      console.log(err);
      return false;
    });
  }

  /* Eliminar cesta por nombre, versión de Santi */
  eliminarCesta(nombreCesta): Promise<boolean> {
    return schCestas.eliminarCesta(nombreCesta).then((res) => {
      return res.acknowledged;
    }).catch((err) => {
      console.log(err);
      return false;
    })
  }

  /* Guarda la cesta en Mongo */
  setCesta(cesta: CestasInterface): Promise<boolean> {
    for(let i = 0; i < cesta.lista.length; i++) {
      cesta.lista[i].subtotal = Number(cesta.lista[i].subtotal.toFixed(2));
    }
    return schCestas.setCesta(cesta).then((res) => {
      if (res.acknowledged) {
        return true;
      } else {
        return false;
      }
    }).catch((err) => {
      console.log(err);
      return false;
    });
  }

  async crearNuevaCesta(nombreCesta: string) {
    if(!nombreCesta || nombreCesta === '' || nombreCesta === ' ') return false;
    const nuevaCesta = this.nuevaCestaVacia();
    nuevaCesta.nombreCesta = nombreCesta;
    return this.setCesta(nuevaCesta).then((res) => {
      if (res) {
        return nuevaCesta;
      } else {
        return false;
      }
    }).catch((err) => {
      console.log(err);
      return false;
    });
  }

  async crearCestaParaTrabajador(idTrabajador: number) {
    if(typeof idTrabajador == 'number') {
      let nuevaCesta = this.nuevaCestaVacia();
      nuevaCesta.idTrabajador = idTrabajador;

      return this.setCesta(nuevaCesta).then((res) => {
        if (res) {
          return nuevaCesta;
        } else {
          return false;
        }
      }).catch((err) => {
        console.log(err);
        return false;
      });
    } else {
      return false;
    }
  }

  /* Obtiene la cesta, borra el  item y devuelve la cesta final */
  borrarItemCesta(idCesta: number, idArticulo: number) {
    return this.getCesta(idCesta).then((cesta) => {
        for (let i = 0; i < cesta.lista.length; i++) {
          if (cesta.lista[i]._id == idArticulo) {
            cesta.lista.splice(i, 1);
            break;
          }
        }
        return this.recalcularIvas(cesta).then((cestaRecalculada) => {
          return this.setCesta(cestaRecalculada).then((result) => {
            if (result) {
              return cestaRecalculada;
            } else {
              return false;
            }
          }).catch((err) => {
            console.log(err);
            return false;
          });
        }).catch((err) => {
          console.log(err);
          return false;
        });
    }).catch((err) => {
        console.log(err);
        return false;
    });
  }

  // cambiarCurrentCesta(data: CestasInterface) {
  //   for(let i = 0; i < data.lista.length; i++) {
  //       data.lista[i].subtotal = Number(data.lista[i].subtotal.toFixed(2));
  //   }
  //   this.cesta = data;
  // }

  // getCurrentCesta() {
  //   return this.cesta;
  // }

  async limpiarCesta(unaCesta: CestasInterface, posicionPrincipal: number, posicionSecundario: number, sobraCantidadPrincipal: number, sobraCantidadSecundario: number, pideDelA: number, pideDelB: number) {
    if(pideDelA != -1) {
      if(sobraCantidadPrincipal > 0) {
        const datosArticulo = await articulosInstance.getInfoArticulo(unaCesta.lista[posicionPrincipal]._id);
        unaCesta.lista[posicionPrincipal].unidades = sobraCantidadPrincipal;
        unaCesta.lista[posicionPrincipal].subtotal = sobraCantidadPrincipal*datosArticulo.precioConIva;
      } else {
        unaCesta.lista.splice(posicionPrincipal, 1);
        }
    }

    if(pideDelB != -1) {
      if(sobraCantidadSecundario > 0) {
        const datosArticulo = await articulosInstance.getInfoArticulo(unaCesta.lista[posicionSecundario]._id);
        unaCesta.lista[posicionSecundario].unidades = sobraCantidadSecundario;
        unaCesta.lista[posicionSecundario].subtotal = sobraCantidadSecundario*datosArticulo.precioConIva;
      } else {
          if(posicionSecundario > posicionPrincipal) {
            unaCesta.lista.splice(posicionSecundario-1, 1);
          } else {
              unaCesta.lista.splice(posicionSecundario, 1);
          }
        }
    }
    return unaCesta;
  }
    async insertarArticuloCesta(infoArticulo, unidades: number, idCesta: number, infoAPeso = null) {
        var miCesta = await this.getCesta(idCesta);

        if(miCesta.lista.length > 0)
        {
            let encontrado = false;
            if(!infoArticulo.suplementos) {
              for(let i = 0; i < miCesta.lista.length; i++) {
                  if(miCesta.lista[i]._id === infoArticulo._id) {
                      var viejoIva = miCesta.tiposIva;
                      
                      if(infoAPeso == null)
                      {
                          miCesta.lista[i].unidades += unidades;
                          miCesta.lista[i].subtotal += unidades*infoArticulo.precioConIva;
                          miCesta.tiposIva = construirObjetoIvas(infoArticulo, unidades, viejoIva);
                      }
                      else
                      {
                        miCesta.lista[i].subtotal += infoAPeso.precioAplicado;
                        miCesta.tiposIva = construirObjetoIvas(infoArticulo, unidades, viejoIva, infoAPeso);
                      }  
                     
                      encontrado = true;
                      break;
                  }
              }
            }
            if(!encontrado)
            {
                if(infoAPeso == null)
                {
                    miCesta.lista.push({_id:infoArticulo._id, nombre: infoArticulo.nombre, unidades: unidades, promocion: {esPromo: false, _id: null}, subtotal: unidades*infoArticulo.precioConIva});
                    miCesta.tiposIva = construirObjetoIvas(infoArticulo, unidades, miCesta.tiposIva);
                }
                else
                {
                    miCesta.lista.push({_id:infoArticulo._id, nombre: infoArticulo.nombre, unidades: unidades, promocion: {esPromo: false, _id: null}, subtotal: infoAPeso.precioAplicado});
                    miCesta.tiposIva = construirObjetoIvas(infoArticulo, unidades, miCesta.tiposIva, infoAPeso);
                }                
            }
        }
        else
        {
            if(infoAPeso == null)
            {
                miCesta.lista.push({_id:infoArticulo._id, nombre: infoArticulo.nombre, unidades: unidades, promocion: {esPromo: false, _id: null}, subtotal: unidades*infoArticulo.precioConIva});
                miCesta.tiposIva = construirObjetoIvas(infoArticulo, unidades, miCesta.tiposIva);
            }
            else
            {
                miCesta.lista.push({_id:infoArticulo._id, nombre: infoArticulo.nombre, unidades: unidades, promocion: {esPromo: false, _id: null}, subtotal: infoAPeso.precioAplicado});
                miCesta.tiposIva = construirObjetoIvas(infoArticulo, unidades, miCesta.tiposIva, infoAPeso);
            }            
        }

        const temporal = await ofertas.buscarOfertas(miCesta, viejoIva);
        return temporal; //await ofertas.buscarOfertas(miCesta, viejoIva);
    }

    async addItem(idArticulo: number, idBoton: string, aPeso: boolean, infoAPeso: any, idCesta: number, unidades: number = 1) {
        var cestaRetornar: CestasInterface = null;
        let infoArticulo;
        if(cajaInstance.cajaAbierta()) {
          try {
            if(!aPeso) { // TIPO NORMAL                  
              
              infoArticulo = await articulosInstance.getInfoArticulo(idArticulo);
              if(infoArticulo) { // AQUI PENSAR ALGUNA COMPROBACIÓN CUANDO NO EXISTA O FALLE ESTE GET
                if(infoArticulo.suplementos){
                  await this.insertarArticuloCesta(infoArticulo, unidades, idCesta);
                  return {
                    suplementos: true,
                    data: await articulosInstance.getSuplementos(infoArticulo.suplementos),
                  }
                } else {
                  cestaRetornar = await this.insertarArticuloCesta(infoArticulo, unidades, idCesta);
                }
              } else {
                
                // vueToast.abrir('error', 'Este artículo tiene errores');
              }
            }
            else { //TIPO PESO
              infoArticulo = await articulosInstance.getInfoArticulo(idArticulo);
              cestaRetornar = await this.insertarArticuloCesta(infoArticulo, 1, idCesta, infoAPeso);
            }
            // console.log(cestaRetornar);
            if (cestaRetornar != undefined && cestaRetornar != null) {
              if (cestaRetornar.tiposIva != undefined && cestaRetornar.tiposIva != null) {
                trabajadoresInstance.getCurrentTrabajador().then((data) => {
                  // console.log(data.nombre);
                  try {
                    impresoraInstance.mostrarVisor({
                      dependienta: data.nombre,
                      total: (cestaRetornar.tiposIva.importe1 + cestaRetornar.tiposIva.importe2 + cestaRetornar.tiposIva.importe3).toFixed(2),
                      precio: infoArticulo.precioConIva.toString(),
                      texto: infoArticulo.nombre,
                    });
                  } catch(err) {
                    console.log(err);
                  }
                })
              }
            }
          }
          catch(err)
          {
              console.log(err);
              // vueToast.abrir('error', 'Error al añadir el articulo');
              this.udsAplicar = 1;
          }
        }
        else
        {
          console.log('Error: La caja está cerrada, no se puede insertar un articulo en la cesta');
            // vueToast.abrir('danger', 'Se requiere una caja abierta para cobrar');
        }
        this.udsAplicar = 1;
        
        return cestaRetornar;
    }
    setUnidadesAplicar(unidades: number) {
        this.udsAplicar = unidades;
    }
    async recalcularIvas(cesta: CestasInterface) {
        cesta.tiposIva = {
            base1: 0,
            base2: 0,
            base3: 0,
            valorIva1: 0,
            valorIva2: 0,
            valorIva3: 0,
            importe1: 0,
            importe2: 0,
            importe3: 0
        }
        for(let i = 0; i < cesta.lista.length; i++) {
            if(cesta.lista[i].promocion.esPromo === false) {
                let infoArticulo = await articulosInstance.getInfoArticulo(cesta.lista[i]._id);
                cesta.tiposIva = construirObjetoIvas(infoArticulo, cesta.lista[i].unidades, cesta.tiposIva);
            }
            else if(cesta.lista[i].promocion.esPromo === true) {
                    if(cesta.lista[i].nombre == 'Oferta combo') {
                        let infoArticuloPrincipal = await articulosInstance.getInfoArticulo(cesta.lista[i].promocion.infoPromo.idPrincipal);
                        infoArticuloPrincipal.precioConIva = cesta.lista[i].promocion.infoPromo.precioRealPrincipal; // /(cesta.lista[i].promocion.infoPromo.unidadesOferta*cesta.lista[i].promocion.infoPromo.cantidadPrincipal);
                        cesta.tiposIva = construirObjetoIvas(infoArticuloPrincipal, cesta.lista[i].promocion.infoPromo.unidadesOferta*cesta.lista[i].promocion.infoPromo.cantidadPrincipal, cesta.tiposIva);

                        let infoArticuloSecundario = await articulosInstance.getInfoArticulo(cesta.lista[i].promocion.infoPromo.idSecundario);
                        infoArticuloSecundario.precioConIva = cesta.lista[i].promocion.infoPromo.precioRealSecundario; // /(cesta.lista[i].promocion.infoPromo.unidadesOferta*cesta.lista[i].promocion.infoPromo.cantidadSecundario);
                        cesta.tiposIva = construirObjetoIvas(infoArticuloSecundario, cesta.lista[i].promocion.infoPromo.unidadesOferta*cesta.lista[i].promocion.infoPromo.cantidadSecundario, cesta.tiposIva);
                    }
                    else {
                        if(cesta.lista[i].nombre == 'Oferta individual') {
                            let infoArticulo = await articulosInstance.getInfoArticulo(cesta.lista[i].promocion.infoPromo.idPrincipal);
                            infoArticulo.precioConIva = cesta.lista[i].promocion.infoPromo.precioRealPrincipal/(cesta.lista[i].promocion.infoPromo.unidadesOferta*cesta.lista[i].promocion.infoPromo.cantidadPrincipal);
                            cesta.tiposIva = construirObjetoIvas(infoArticulo, cesta.lista[i].promocion.infoPromo.unidadesOferta*cesta.lista[i].promocion.infoPromo.cantidadPrincipal, cesta.tiposIva);
                        }
                    }
                  }
            
        }
        return cesta;
    }

    async borrarArticulosCesta(idCesta: number) {
      const cestaActual = await this.getCesta(idCesta);
      const vacia = this.nuevaCestaVacia();
      cestaActual.lista = vacia.lista;
      cestaActual.regalo = false;
      cestaActual.tiposIva = vacia.tiposIva;
      return this.setCesta(cestaActual).then((res) => {
        if (res) {
          return cestaActual;
        }
        return false;
      }).catch((err) => {
        console.log(err);
        return false;
      });
    }

    async addSuplemento(idCesta, suplementos, idArticulo, posArticulo = -100) {
      suplementos = suplementos.map(o => o.suplemento);
      const cestaActual = await this.getCesta(idCesta);
      cestaActual.lista = cestaActual.lista.reverse();
      let indexArticulo = posArticulo;
      if(posArticulo === -100) indexArticulo = cestaActual.lista.findIndex(i => i._id === idArticulo);
      console.log(indexArticulo);
      cestaActual.lista[indexArticulo].suplementosId = suplementos;
      for(let i in suplementos) {
        const idSuplemento = suplementos[i];
        const infoSuplemento = await articulosInstance.getInfoArticulo(idSuplemento);
        cestaActual.lista[indexArticulo].subtotal += infoSuplemento.precioConIva;
        cestaActual.lista[indexArticulo].nombre += ` + ${infoSuplemento.nombre}`;
      }
      cestaActual.lista = cestaActual.lista.reverse();
      return this.setCesta(cestaActual).then((res) => {
        if(res) return cestaActual;
        return false;
      }).catch((err) => {
        console.log(err);
        return false;
      });
    }

    async modificarSuplementos(cestaId, idArticulo, posArticulo) {
      const cestaActual = await this.getCesta(cestaId);
      // const indexArticulo = cestaActual.lista.findIndex(i => i._id === idArticulo);
      cestaActual.lista = cestaActual.lista.reverse();
      const indexArticulo = posArticulo;
      const suplementos = cestaActual.lista[indexArticulo].suplementosId;
      const infoArticulo = await articulosInstance.getInfoArticulo(idArticulo);
      const suplementosArticulo = await articulosInstance.getSuplementos(infoArticulo.suplementos);
      cestaActual.lista[indexArticulo].nombre = cestaActual.lista[indexArticulo].nombre.split('+')[0];
      cestaActual.lista[indexArticulo].suplementosId = [];
      for(let i = 0; i < suplementos.length; i++) {
        const dataArticulo = await articulosInstance.getInfoArticulo(suplementos[i]);
        cestaActual.lista[indexArticulo].subtotal -= dataArticulo.precioConIva;
      }
      cestaActual.lista = cestaActual.lista.reverse();
      this.setCesta(cestaActual);
      const res = {
        suplementos: suplementosArticulo.length > 0 ? true : false,
        suplementosData: suplementosArticulo,
        suplementosSeleccionados: suplementos,
      };
      return res;
    }

    async enviarACocina(idCesta) {
      const cestaActual = await this.getCesta(idCesta);
      const nombreMesa = cestaActual.idCestaSincro ? cestaActual.idCestaSincro.split(' ')[0] === 'Taula' ? cestaActual.idCestaSincro : 'Barra' : 'Barra';
      let articulos = '';
      const suplementos = cestaActual.lista.map(i => ({ [i._id]: i.suplementosId ? i.suplementosId.map( o => o ) : []}));
      for(let i in suplementos) {
        const key = Object.keys(suplementos[i])[0];
        articulos += key;
        if(suplementos[i][key].length) {
          articulos += suplementos[i][key].map(i => `|${i}`).join('');
        }
        articulos += ',';
      }
      articulos = articulos.slice(0, -1);
      return axios.get(`http://gestiondelatienda.com/printer/cocina.php?id_tienda=${parametrosInstance.getParametros().codigoTienda}&pedidos=${articulos}&empresa=${parametrosInstance.getParametros().database}&mesa=${nombreMesa}`).then((res: any) => {
        return true;
      }).catch((err) => {
          return false;
      });
    }

    async getCestaDiferente(id_cesta) {
      return schCestas.getCestaDiferente(id_cesta).then((result) => {
        return result ? result : false;
      })
    }

    getCestaByTrabajadorID(idTrabajador: number): Promise<CestasInterface> {
      return schCestas.getCestaByTrabajadorID(idTrabajador).then((res) => {
        if (res != null) {
          return res;
        } else { // Si la cesta no existe, crearla para este trabajador
          return this.crearCestaParaTrabajador(idTrabajador).then((resCesta) => {
            if (resCesta) {
              return resCesta;
            }
            return null;
          })
        }
      }).catch((err) => {
        console.log(err);
        return null;
      });
    }
}

const cestas = new CestaClase();

export { cestas }