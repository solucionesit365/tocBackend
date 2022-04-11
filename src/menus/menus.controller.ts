import { Controller, Post, Body } from '@nestjs/common';
import { menusInstance } from './menus.clase';

@Controller('menus')
export class MenusController {
    @Post('clickMenu')
    clickMenu(@Body() params) {
        // console.log('Fecha de llegada: ', Date.now());
        if (menusInstance.getBloqueado() == false) {
            menusInstance.setBloqueado(true);
            return menusInstance.clickMenu(params.nombreMenu).then((res) => {
                menusInstance.setBloqueado(false);
                return {
                    bloqueado: false,
                    resultado: res
                };
            }).catch((err) => {
                menusInstance.setBloqueado(false);
                return {
                    bloqueado: false,
                    error: err
                }
            });
        } else {
            return {
                bloqueado: true
            }
        }
    }

    @Post('getMenus')
    getMenus() {
        return menusInstance.getMenus().then((resultado) => {
            if(menusInstance.getBloqueado() == false) {
                return {bloqueado: false, resultado: resultado};
            }
            else {
                return {bloqueado: true};
            }        
        });
    }

    @Post('getSubmenus')
    getSubmenus(@Body() params) {
        return menusInstance.getSubmenus(params.tag).then((res) => {
            if(!menusInstance.getBloqueado()) return { bloqueado: false, resultado: res };
            return { bloqueado: true };
        })
    }
}
