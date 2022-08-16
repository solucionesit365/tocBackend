import {Controller, Post, Body, Get} from '@nestjs/common';
import {Console} from 'console';
import {UtilesModule} from 'src/utiles/utiles.module';
import {trabajadoresInstance} from '../trabajadores/trabajadores.clase';
import {cestas} from './cestas.clase';

@Controller('cestas')
export class CestasController {
    @Post('borrarCesta')
  borrarCesta(@Body() params) {
    return cestas.borrarCesta(params.id).then((res) => {
      if (res) {
        return cestas.getTodasCestas().then((listaCestas) => {
          if (listaCestas.length > 0) {
            return {
              okey: true,
              cestaNueva: listaCestas[0],
            };
          } else {
            const nueva = cestas.nuevaCestaVacia();
            return cestas.setCesta(nueva).then((resultado) => {
              if (resultado) {
                return {
                  okey: true,
                  cestaNueva: nueva,
                };
              } else {
                return {
                  okey: false,
                  error: 'Error en crear nueva cesta',
                };
              }
            });
          }
        }).catch((err) => {
          return {
            okey: false,
            error: 'Error en getTodasCestas',
          };
        });
      } else {
        return {
          okey: false,
          error: 'Error borrando cesta',
        };
      }
    }).catch((err) => {
      return {
        okey: false,
        error: 'Error en borrarCesta',
      };
    });
  }

    @Post('borrarItemCesta')
    borrarItemCesta(@Body() params) {
      return cestas.borrarItemCesta(params._id, params.idArticulo).then((res) => {
        return {
          okey: true,
          cestaNueva: res,
        };
      }).catch((err) => {
        return {
          okey: false,
          error: 'Error en borrarItemCesta',
        };
      });
    }

    @Post('borrarArticulosCesta')
    borrarArticulosCesta(@Body() params) {
      if (params.idCesta != undefined && params.idCesta != null) {
        return cestas.borrarArticulosCesta(params.idCesta).then((res) => {
          if (res) {
            return {error: false, info: res};
          }
          return {error: true, mensaje: 'Backend: Error en cestas/borrarArticulosCesta >'};
        });
      } else {
        return {error: true, mensaje: 'Backend: Error cestas/borrarArticulosCesta faltan datos'};
      }
    }

    @Post('getCesta')
    getCesta(@Body() params) {
      if (UtilesModule.checkVariable(params.idCesta)) {
        return cestas.getCesta(params.idCesta).catch((err) => {
          console.log(err);
          return { error: true, mensaje: err.message };
        });
      } else {
        return { error: true, mensaje: "Backend: Faltan parámetros en cestas/getCesta" };
      }
    }

    @Post('getCestaByID')
    getCestaByID(@Body() params) {
      if (params.idCesta != undefined && params.idCesta != null) {
        if (params.idCesta == -1) {
          return trabajadoresInstance.getCurrentTrabajador().then((res) => {
            return cestas.getCesta(res._id).then((res) => {
              if (res) {
                return {error: false, info: res};
              }

              return {error: true, mensaje: 'Backend: Error en cestas/getCestaByID'};
            }).catch((err) => {
              console.log(err);
              return {error: true, mensaje: 'Backend: Error en cestas/getCestaByID CATCH'};
            });
          });
          // return cestas.getCestaRandom().then((res) => {
          //     return { error: false, info: res };
          // }).catch((err) => {
          //     console.log(err);
          //     return { error: true, mensaje: 'Backend: Error en cestas/getCestaByID > getCestaRandom CATCH' };
          // });
        } else {
          return cestas.getCesta(params.idCesta).then((res) => {
            if (res) {
              return {error: false, info: res};
            }


            return {error: true, mensaje: 'Backend: Error en cestas/getCestaByID'};
          }).catch((err) => {
            console.log(err);
            return {error: true, mensaje: 'Backend: Error en cestas/getCestaByID CATCH'};
          });
        }
      } else {
        return {error: true, mensaje: 'Backend: Error en cestas/getCestaByID FALTAN DATOS'};
      }
    }

    @Get('getCestaCurrentTrabajador')
    getCestaCurrentTrabajador() {
      return trabajadoresInstance.getCurrentTrabajador().then((res) => {
        if (res != null) {
          return cestas.getCestaByTrabajadorID(res._id).then((res) => {
            if (res) {
              return {error: false, info: res};
            }
            return {error: true, mensaje: 'Backend: Error en cestas/getCestaByID'};
          }).catch((err) => {
            console.log(err);
            return {error: true, mensaje: 'Backend: Error en cestas/getCestaByID CATCH'};
          });
        } else {
          return {error: true, mensaje: 'Backend: Error, no hay ningún trabajador activo'};
        }
      });
    }

    @Post('crearCesta')
    crearCesta(@Body() params) {
      if (params.nombreCesta != undefined && params.nombreCesta != null) {
        return cestas.crearNuevaCesta(params.nombreCesta).then((res) => {
          if (res) {
            return {error: false, info: res};
          } else {
            return {error: true, mensaje: 'Backend: Error en cestas/crearCesta. No se ha podido crear la nueva cesta'};
          }
        });
      } else {
        return {error: true, mensaje: 'Backend: Error en cestas/crearCesta FALTAN DATOS'};
      }
    }

    @Post('cambiarCestaTrabajador')
    cambiarCestaTrabajador(@Body() params) {
      if (params.id_cesta != undefined && params.id_cesta != null) {
        return cestas.updateIdCestaTrabajador(params.id).then((res) => {
          if (res) {
            return {error: false, info: res};
          } else {
            return {error: true, mensaje: 'Backend: Error en cestas/crearCesta. No se ha podido crear la nueva cesta'};
          }
        });
      } else {
        return {error: true, mensaje: 'Backend: Error en cestas/crearCesta FALTAN DATOS'};
      }
    }
    @Post('cerarCestaMesas')
    cerarCestaMesas(@Body() params) {
      if (params.id_cesta != undefined && params.id_cesta != null) {
        return cestas.cerarCestaMesas(params.idTrabajador, params.nombreMesa);
      } else {
        return {error: true, mensaje: 'Backend: Error en cestas/crearCesta FALTAN DATOS'};
      }
    }


    @Get('getCestas')
    getCestas() {
      return cestas.getTodasCestas().then((res) => {
        return {error: false, info: res};
      }).catch((err) => {
        console.log(err);
        return {error: true, mensaje: 'Backend: Error en cestas/getCestas CATCH'};
      });
    }

    @Post('setUnidadesAplicar')
    setUnidadesAplicar(@Body() params) {
      cestas.setUnidadesAplicar(params.unidades);
      return {okey: true};
    }

    @Post('clickTeclaArticulo')
    async clickTeclaArticulo(@Body() params) {
      return await cestas.addItem(params.idArticulo, params.idBoton, params.peso, params.infoAPeso, params.idCesta, params.unidades).then((res) => {
        return {
          error: false,
          bloqueado: false,
          cesta: res,
        };
      }).catch((err) => {
        return {
          error: true,
          bloqueado: false,
        };
      });
    }


    @Post('regalarProducto')
    regalarProducto(@Body() params) {
      if (params.idCesta != undefined && params.index != undefined) {
        return cestas.getCesta(params.idCesta).then((cesta) => {
          if (cesta != null) {
            cesta.lista[params.index].subtotal = 0;
            cesta['regalo'] = true;
            return cestas.setCesta(cesta).then((res) => {
              if (res) {
                return {error: false, cesta: cesta};
              }
              return {error: true, mensaje: 'Backend: Error en cestas/regalarProductos > setCesta'};
            }).catch((err) => {
              console.log(err);
              return {error: true, mensaje: 'Backend: Error en cestas/regalarProductos > setCesta CATCH'};
            });
          } else {
            return {error: true, mensaje: 'Backend: Error, cesta vacía'};
          }
        }).catch((err) => {
          console.log(err);
          return {error: true, mensaje: 'Backend: Error en cestas/regalarProducto > getCesta CATCH'};
        });
      } else {
        return {error: true, mensaje: 'Backend: Error: faltan datos en cestas/regalarProducto'};
      }
    }

    @Post('addSuplemento')
    addSuplemento(@Body() params) {
      if (params.idCesta && params.suplementos && params.idArticulo) {
        return cestas.addSuplemento(params.idCesta, params.suplementos, params.idArticulo, params.posArticulo).then((res) => {
          return {
            error: false,
            bloqueado: false,
            cesta: res,
          };
        }).catch((err) => {
          console.log(err);
          return {
            error: true,
            bloqueado: false,
          };
        });
      }
    }

    @Post('modificarSuplementos')
    modificarSuplementos(@Body() params) {
      if (params.cestaId && params.idArticulo) {
        return cestas.modificarSuplementos(params.cestaId, params.idArticulo, params.posArticulo).then((res) => {
          if (res.suplementos) {
            return {
              suplementos: true,
              suplementosData: res.suplementosData,
              suplementosSeleccionados: res.suplementosSeleccionados,
            };
          }
          return {suplementos: false};
        });
      }
    }

    @Post('enviarACocina')
    enviarACocina(@Body() params) {
      if (params.idCesta) {
        return cestas.enviarACocina(params.idCesta).then((res) => {
          return res;
        });
      }
    }


    /**
     * Metodod que llaman desde tocgame.js en el frontend en iniciartoc()
     * es el metodo que carga en raiz la cesta selecionada
     * @param params
     * @returns
     */
    @Post('getCestaByTrabajadorId')
    async getCestaByTrabajadorId(@Body() params) {
      if (UtilesModule.checkVariable(params.idCesta)) {
        return {error: false, info: await cestas.getCestaByID(params.idCesta)};
      } else {
        return {error: true, mensaje: 'Backend error, faltan datos en cestas/getCestaByTrabajadorId'};
      }
    }


    @Post('borrarCestaTrabajador')
    borrarCestaTrabajador(@Body() params) {
      return cestas.borrarCestaTrabajador(params.id).then((res) => {
        if (res) {
          return cestas.getTodasCestas().then((listaCestas) => {
            if (listaCestas.length > 0) {
              return {
                okey: true,
                cestaNueva: listaCestas[0],
              };
            }
          }).catch((err) => {
            return {
              okey: false,
              error: 'Error en getTodasCestas',
            };
          });
        } else {
          return {
            okey: false,
            error: 'Error borrando cesta trabajador',
          };
        }
      }).catch((err) => {
        return {
          okey: false,
          error: 'Error en borrarCesta',
        };
      });
    }
}
