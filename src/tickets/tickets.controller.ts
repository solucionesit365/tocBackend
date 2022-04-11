import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { ticketsInstance } from './tickets.clase';
import { cajaInstance } from '../caja/caja.clase';

@Controller('tickets')
export class TicketsController {

    @Post('getTicketsIntervalo')
    getTicketsIntervalo(@Query() params) {
        return cajaInstance.getInfoCaja().then((infoCaja) => {
            if (infoCaja != null) {
                return ticketsInstance.getTicketsIntervalo(infoCaja.inicioTime, Date.now());
            } else {
                return [];
            }
        }).catch((err) => {
            console.log(err);
            return [];
        });
    }

    @Post('crearTicketEfectivo')
    crearTicketEfectivo(@Body() params) {
        if (params.total != undefined && params.idCesta != undefined && params.idCliente != undefined) {
            return ticketsInstance.crearTicketEfectivo(params.total, params.idCesta, params.idCliente).then((res) => {
                if (res) {
                    return {
                        error: false
                    }
                } else {
                    return {
                        error: true,
                        mensaje: 'Error en crearTicketEfectivo'
                    }
                }
            }).catch((err) => {
                console.log(err);
                return {
                    error: true,
                    mensaje: 'Error. Comprobar log nest'
                }
            });
        } else {
            return { error: true, mensaje: 'Faltan datos'};
        }
    }

    @Post('crearTicketDatafono3G')
    crearTicketDatafono3G(@Body() params) {
        if (params.total != undefined && params.idCesta != undefined && params.idCliente != undefined) {
            return ticketsInstance.crearTicketDatafono3G(params.total, params.idCesta, params.idCliente).then((res) => {
                if (res) {
                    return {
                        error: false
                    }
                } else {
                    return {
                        error: true,
                        mensaje: 'Error en crearTicketDatafono3G'
                    }
                }
            }).catch((err) => {
                console.log(err);
                return {
                    error: true,
                    mensaje: 'Error. Comprobar log nest'
                }
            });
        } else {
            return { error: true, mensaje: 'Faltan datos'};
        }
    }

    @Post('crearTicketDeuda')
    crearTicketDeuda(@Body() params) {
        if (params.total != undefined && params.idCesta != undefined && params.idCliente != undefined && params.infoClienteVip != undefined) {
            return ticketsInstance.crearTicketDeuda(params.total, params.idCesta, params.idCliente, params.infoClienteVip).then((res) => {
                if (res) {
                    return { error: false };
                }
                return { error: true, mensaje: 'Backend: Error en tickets/crearTicketDeuda'};
            }).catch((err) => {
                console.log(err);
                return { error: true, mensaje: 'Backend: Error en tickets/crearTicketDeuda CATCH'};
            });
        } else {
            return { error: true, mensaje: 'Faltan datos en tickets/crearTicketDeuda'};
        }
    }

    @Post('crearTicketConsumoPersonal')
    crearTicketConsumoPersonal(@Body() params) {
        if (params.idCesta != undefined) {
            return ticketsInstance.crearTicketConsumoPersonal(params.idCesta).then((res) => {
                if (res) {
                    return { error: false };
                } 
                return { error: true, mensaje: 'Backend: Error en tickets/crearTicketConsumoPersonal'};
            }).catch((err) => {
                console.log(err);
                return { error: true, mensaje: 'Backend: Error en tickets/crearTicketConsumoPersonal CATCH'};
            });
        } else {
            return { error: true, mensaje: 'Faltan datos en tickets/crearTicketConsumoPersonal'};
        }
    }

    // @Post('crearTicketDatafonoClearOne')
    // crearTicketDatafonoClearOne(@Body() params) {
    //     return ticketsInstance.crearTicketDatafono3G(params.total, params.idCesta).then((res) => {
    //         if (res) {
    //             return {
    //                 error: false
    //             }
    //         } else {
    //             return {
    //                 error: true
    //             }
    //         }
    //     }).catch((err) => {
    //         console.log(err);
    //         return {
    //             error: true
    //         }
    //     });
    // }

    @Post('crearTicketTKRS')
    crearTicketTKRS(@Body() params) {
        if(params.total != undefined && params.idCesta != undefined && params.idCliente != undefined) {
            return ticketsInstance.crearTicketTKRS(params.total, params.totalTkrs, params.idCesta, params.idCliente).then((res) => {
                if (res) {
                    return { error: false }
                }
                return { error: true, mensaje: 'Backend: Error en tickets/crearTicketTKRS' };
            }).catch((err) => {
                console.log(err);
                return { error: true, mensaje: 'Backend: Error en tickets/crearTicketTKRS CATCH' };
            })
        } else {
            return { error: true, mensaje: 'Faltan datos en tickets/crearTicketTKRS' };
        }
    }

    @Get('getListadoVentas')
    getListadoVentas(@Query() params) {{
        if(params.start && params.end) {
            return ticketsInstance.getTicketsIntervalo(params.start, params.end);
        }
    }}
}
