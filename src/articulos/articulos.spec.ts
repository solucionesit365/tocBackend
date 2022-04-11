// 100%
import { Articulos } from './articulos.clase';

describe('Articulos', () => {
  const artiInstance = new Articulos();
  it('should be defined', () => {
    expect(artiInstance).toBeDefined();
  });

  it('setEstadoTarifaEspecial', async () => {
    artiInstance.setEstadoTarifaEspecial(true);
    expect(artiInstance.estadoTarifaVIP).toEqual(true);
  });

  it('getEstadoTarifaEspecial', async () => {
    expect(typeof artiInstance.getEstadoTarifaEspecial()).toEqual("boolean");
    expect(artiInstance.getEstadoTarifaEspecial()).toEqual(artiInstance.estadoTarifaVIP);
  });

  it('getInfoArticulo', async () => {
    artiInstance.setEstadoTarifaEspecial(false);
    const res = await artiInstance.getInfoArticulo(4203);

    expect(res._id).toBeDefined();
    expect(res.esSumable).toBeDefined();
    expect(res.familia).toBeDefined();
    expect(res.nombre).toBeDefined();
    expect(res.precioBase).toBeDefined();
    expect(res.precioConIva).toBeDefined();
    expect(res.tipoIva).toBeDefined();
  });
});
