import { Controller, Post } from '@nestjs/common';
import axios from 'axios';
import { parametrosInstance } from 'src/parametros/parametros.clase';
import { paramsTicketInstance } from './params-ticket.class';

@Controller('params-ticket')
export class ParamsTicketController {
    @Post('descargarInfoTicket')
    descargarInfoTicket() {
        const parametros = parametrosInstance.getParametros();
        return axios.post('info-ticket/getInfoTicket', { database: parametros.database, idCliente: parametros.codigoTienda }).then((res: any) => {
            return paramsTicketInstance.insertarParametrosTicket(res.data.info).then((res2) => {
                if (res2) {
                    return { error: false };
                }
                return { error: true, mensaje: 'Backend: Error en params-ticket/descargarInfoTicket > insertarParametrosTicket'};
            } );
        }).catch((err) => {
            console.log(err);
            return { error: true, mensaje: 'Backend: Error en params-ticket/descargarInfoTicket CATCH' };
        });
    }
}
