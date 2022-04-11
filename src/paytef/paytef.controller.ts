import { Body, Controller, Get, Post } from '@nestjs/common';
import axios from 'axios';
import { Console } from 'console';
import { LogsClass } from 'src/logs/logs.class';
import { transaccionesInstance } from 'src/transacciones/transacciones.class';
import { TransaccionesInterface } from 'src/transacciones/transacciones.interface';
import { UtilesModule } from 'src/utiles/utiles.module';
import { parametrosInstance } from '../parametros/parametros.clase';
import { ticketsInstance } from '../tickets/tickets.clase';
import { paytefInstance } from './paytef.class';
// import find from 'local-devices'

const exec = require('child_process').exec;
const os = require('os');

@Controller('paytef')
export class PaytefController {
    // @Post('iniciarTransaccion')
    // async iniciarTransaccion(@Body() params) {
    //     if (params != undefined || params != null) {
    //         if (UtilesModule.checkVariable(params.cantidad)) {
    //             try {
    //                 var nuevoIdTicket = (await ticketsInstance.getUltimoTicket()) + 1;
    //             } catch(err) {
    //                 console.log(err);
    //                 return { error: true, mensaje: 'Backend: paytef/iniciarTransaccion iniciarTransaccion() CATCH 2' };
    //             }
    //             return paytefInstance.iniciarTransaccion(params.cantidad, nuevoIdTicket, params.idCesta).then((res) => {
    //                 if (res) {
    //                     return { error: false };
    //                 } else {
    //                     return { error: true, mensaje: 'Backend: paytef/iniciarTransaccion iniciarTransaccion() ERROR' };
    //                 }
    //             });
    //         } else {
    //             return { error: true, mensaje: 'Backend: paytef/iniciarTransaccion faltan datos' };
    //         } 
    //     } else {
    //         return { error: true, mensaje: 'Backend: paytef/iniciarTransaccion faltan todos los datos' };
    //     }
    // }
    // @Post('iniciarTransaccion')
    // async iniciarTransaccion(@Body() params) {
    //     /* Comprobando que params tenga sentido */
    //     if (UtilesModule.checkVariable(params)) {
    //         /* Comprobando que idClienteFinal sea string */
    //         if (UtilesModule.checkVariable(params.idClienteFinal)) {
    //             /* Creo la transacción e inicio la petición de cobro a PayTef */
    //             return paytefInstance.iniciarTransaccion(params.idClienteFinal).then((res) => {
    //                 return res;
    //             }).catch((err) => {
    //                 console.log(err.message);
    //                 LogsClass.newLog(params, err.message);
    //                 return { error: true, mensaje: 'Backend: paytef/iniciarTransaccion CATCH' };
    //             });
    //         } else {
    //             return { error: true, mensaje: 'Backend: paytef/iniciarTransaccion faltan datos' };
    //         } 
    //     } else {
    //         return { error: true, mensaje: 'Backend: paytef/iniciarTransaccion faltan todos los datos' };
    //     }
    // }

    @Get('polling')
    async comprobarEstado() {
        /* OBTENGO IP PAYTEF & ÚLTIMA TRANSACCIÓN DE MONGODB */
        const ipDatafono = parametrosInstance.getParametros().ipTefpay;
        const ultimaTransaccion: TransaccionesInterface = await transaccionesInstance.getUltimaTransaccion();
        
        return axios.post(`http://${ipDatafono}:8887/transaction/poll`, {
          pinpad: "*"
        }).then((res: any) => {
            if (res.data.result != null && res.data.result != undefined) {
                if (res.data.result.transactionReference === ultimaTransaccion._id.toString()) {
                    if (res.data.result.approved && !res.data.result.failed) {
                        return paytefInstance.cerrarTicket(res.data.result.transactionReference).then((resCierreTicket) => {
                            if (resCierreTicket.error) {
                                return { error: true, mensaje: resCierreTicket.mensaje };
                            }
                            return { error: false, continuo: false };
                        });                        
                    } else {
                        return { error: true, mensaje: 'Operación denegada' };
                    }                    
                } else {
                    return { error: false, continuo: true };
                }
            } else {
                if (res.data.info != null && res.data.info != undefined) {
                    if (res.data.info.transactionStatus === 'cancelling') {
                        return { error: true, mensaje: 'Operación cancelada' };
                    } else {
                        return { error: false, continuo: true };
                    }
                } else {
                    return { error: false, continuo: true };
                }
            }
        }).catch((err) => {
            if (err.message == 'Request failed with status code 500') {
                return { error: false, continuo: true };
            } else {
                console.log(err.message);
                return { error: true, mensaje: "Error catch cobro paytef controller" };
            }            
        });
    }

    @Get('cancelarOperacionActual')
    cancelarOperacionActual() {
        const ipDatafono = parametrosInstance.getParametros().ipTefpay;
        return axios.post(`http://${ipDatafono}:8887/pinpad/cancel`, { pinpad: "*" }).then((res: any) => {
            if (res.data.info.success === true) {
                return true;
            } else {
                return false;
            }            
        }).catch((err) => {
            console.log(err);
            return false;
        });
    }

    @Get('scanDevices')
    buscarDispositivos() {
        exec("arp -a", (err, stdout, stderr) => {
            if (err) {
                console.log(err);
            } else {
                let ipTefpay = '';
                const arrayDevices: any = stdout.split(/\r?\n/);
                for(let i = 0; i < arrayDevices.length; i++) {
                    if (arrayDevices[i].includes('A30')) {
                        ipTefpay = arrayDevices[i].split(' ');
                        break;
                    }
                }
                console.log(ipTefpay);
            }
        });
        // find().then(devices => {
        //     devices /*
        //     [
        //       { name: '?', ip: '192.168.0.10', mac: '...' },
        //       { name: '?', ip: '192.168.0.50', mac: '...' },
        //       { name: '?', ip: '192.168.0.155', mac: '...' },
        //       { name: '?', ip: '192.168.0.211', mac: '...' }
        //     ]
        //     */
        // })
    }

    // @Get('resultadoFinal')
    // async resultadoFinal() {
    //     try {
    //         const ipDatafono = parametrosInstance.getParametros().ipTefpay;
    //         const resPaytef = await axios.post(`http://${ipDatafono}:8887/transaction/poll`, {
    //             pinpad: "*"
    //         });
    //         return paytefInstance.checkPagado(resPaytef.data);
    //     } catch(err) {
    //         console.log(err);
    //         return { error: true, mensaje: 'Backend: Error en paytef/resultadoFinal CATCH' };
    //     }
    // }
}
