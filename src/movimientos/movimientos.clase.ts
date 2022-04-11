import { parametrosInstance } from "../parametros/parametros.clase";
import { MovimientosInterface } from "./movimientos.interface";
import * as schMovimientos from "./movimientos.mongodb";
import { impresoraInstance } from "../impresora/impresora.class";
import { trabajadoresInstance } from "../trabajadores/trabajadores.clase";
const moment = require('moment');
const Ean13Utils  = require('ean13-lib').Ean13Utils;
const TIPO_ENTRADA = 'ENTRADA';
const TIPO_SALIDA = 'SALIDA';

function getNumeroTresDigitos(x: number) {
    let devolver = '';
    if(x< 100 && x >=10) {
        devolver = '0' + x;
    } else {
        if(x < 10 && x >= 0) {
            devolver = '00' + x;
        } else {
            devolver = x.toString();
        }
    }
    return devolver;
}

export class MovimientosClase {
    /* Devuelve un array de movimientos entre dos instantes de tiempo */
    getMovimientosIntervalo(inicioTime: number, finalTime: number): Promise<MovimientosInterface[]> {
        return schMovimientos.getMovimientosIntervalo(inicioTime, finalTime);
    }

    /* 
        Inserta una nueva salida de dinero en BBDD. Si el idTicket no se establece, es una salida manual.
        En caso contrario, se trata de una salida provocada por un pago con tarjeta (por ejemplo).
     */
    public async nuevaSalida(cantidad: number, concepto: string, tipoExtra: string, imprimir: boolean = true, idTicket: number = -100) {
        const parametros = parametrosInstance.getParametros();
        let codigoBarras = "";
        try {
            if (tipoExtra != 'TARJETA' && tipoExtra != 'TKRS' && tipoExtra != 'TKRS_SIN_EXCESO' && tipoExtra != 'TKRS_CON_EXCESO' && tipoExtra != 'DEUDA') {
                codigoBarras = await this.generarCodigoBarrasSalida();
                codigoBarras = String(Ean13Utils.generate(codigoBarras));
            } 
        } catch(err) {
            console.log(err);
        }
        
        const objSalida: MovimientosInterface = {
            _id: Date.now(),
            tipo: TIPO_SALIDA,
            valor: Number(cantidad),
            concepto: concepto,
            idTrabajador: (await trabajadoresInstance.getCurrentTrabajador())._id,
            codigoBarras: codigoBarras,
            tipoExtra: tipoExtra,
            idTicket: idTicket,
            enviado: false,
            enTransito: false,
            intentos: 0,
            comentario: ''
        }
        const resNuevaSalida = await schMovimientos.nuevaSalida(objSalida);

        if (resNuevaSalida.acknowledged) {
            if (imprimir) {
                impresoraInstance.imprimirSalida(
                    objSalida.valor,
                    objSalida._id,
                    (await trabajadoresInstance.getCurrentTrabajador()).nombre,
                    parametros.nombreTienda,
                    objSalida.concepto,
                    parametros.tipoImpresora,
                    codigoBarras
                );
            }
            return true;
        } else {
            return false;
        }
    }

    /* 
        Inserta una nueva entrada de dinero en BBDD.
        Se imprime por defecto.
     */
    public async nuevaEntrada(cantidad: number, concepto: string, imprimir: boolean = true) {
        const parametros = parametrosInstance.getParametros();
        const objSalida: MovimientosInterface = {
            _id: Date.now(),
            tipo: TIPO_ENTRADA,
            valor: Number(cantidad),
            concepto: concepto,
            idTrabajador: (await trabajadoresInstance.getCurrentTrabajador())._id,
            codigoBarras: '',
            tipoExtra: TIPO_ENTRADA,
            idTicket: -100,
            enviado: false,
            enTransito: false,
            intentos: 0,
            comentario: ''
        }
        const resNuevaSalida = await schMovimientos.nuevaSalida(objSalida);

        if (resNuevaSalida.acknowledged) {
            if (imprimir) {
                impresoraInstance.imprimirEntrada(objSalida.valor, objSalida._id, (await trabajadoresInstance.getCurrentTrabajador()).nombre);
            }
            return true;
        } else {
            return false;
        }
    }

    private async generarCodigoBarrasSalida() {
        const parametros = parametrosInstance.getParametros();
        const ultimoCodigoDeBarras = await schMovimientos.getUltimoCodigoBarras();
        if (ultimoCodigoDeBarras == null) {
            if((await schMovimientos.resetContadorCodigoBarras()).acknowledged == false)
                throw 'Error en inicializar contador de codigo de barras';
        }

        let objCodigoBarras = (await schMovimientos.getUltimoCodigoBarras()).ultimo;
        if(objCodigoBarras == 999) {
            const resResetContador = await schMovimientos.resetContadorCodigoBarras();
            if (!resResetContador.acknowledged) {
                throw 'Error en resetContadorCodigoBarras';
            }
        } else {
            const resActualizarContador = await schMovimientos.actualizarCodigoBarras();
            if (!resActualizarContador.acknowledged) {
                throw 'Error en actualizarCodigoBarras';
            }
        }

        objCodigoBarras = (await schMovimientos.getUltimoCodigoBarras()).ultimo;

        let codigoLicenciaStr: string = getNumeroTresDigitos(parametros.licencia);
        let strNumeroCodigosDeBarras: string = getNumeroTresDigitos(objCodigoBarras);
        let codigoFinal: string =  '';
        let digitYear = new Date().getFullYear().toString()[3];


        codigoFinal = `98${codigoLicenciaStr}${digitYear}${getNumeroTresDigitos(moment().dayOfYear())}${strNumeroCodigosDeBarras}`;
        return codigoFinal;
    }

    getMovimientoMasAntiguo() {
        return schMovimientos.getMovimientoMasAntiguo();
    }

    actualizarEstadoMovimiento(movimiento: MovimientosInterface) {
        return schMovimientos.actualizarEstadoMovimiento(movimiento).then((res) => {
            return res.acknowledged;
        }).catch((err) => {
            console.log(err);
            return false;
        });
    }
    
}

export const movimientosInstance = new MovimientosClase();
