import { Controller, Post, Query, Body } from '@nestjs/common';
import { menusInstance } from 'src/menus/menus.clase';
import { dobleMenusInstance } from './doble-menus.clase';

@Controller('doble-menus')
export class DobleMenusController {
    @Post('clickMenu')
    clickMenu(@Body() params) {
        if(!dobleMenusInstance.getBloqueado()) {
            dobleMenusInstance.setBloqueado(true);
            return menusInstance.getSubmenus(params.tag).then((res) => {
                dobleMenusInstance.setBloqueado(false);
                return {
                    bloqueado: false,
                    resultado: res,
                }
            }).catch((err) => {
                menusInstance.setBloqueado(false);
                return {
                    bloqueado: false,
                    error: err,
                }
            })
        } else {
            return {
                bloqueado: true,
            }
        }
    }

    @Post('getMenus')
    getMenus() {
        return dobleMenusInstance.getMenus().then((resultado) => {
            if(!dobleMenusInstance.getBloqueado()) {
                return {bloqueado: false, resultado: resultado};
            }
            else {
                return {bloqueado: true};
            }        
        });
    }
}