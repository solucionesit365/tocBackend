export interface ArticulosInterface {
    _id: number,
    tipoIva: number,
    precioConIva: number,
    precioBase: number,
    nombre: string,
    familia: string,    
    esSumable: boolean,
    suplementos?: [],
}
