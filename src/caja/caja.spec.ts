import { conexion } from '../conexion/mongodb';
import { CajaClase } from '../caja/caja.clase';

describe('Caja', () => {
  const cajaInstance = new CajaClase();

  it('should be defined', () => {
    expect(cajaInstance).toBeDefined();
  });

  it('getInfoCaja', () => {    
    cajaInstance.getInfoCaja().then((caja) => {
      if (caja != null) {
        expect(caja._id).toEqual("CAJA");
      } else {
        expect(caja).toEqual(null);
      }
      conexion.then((client) => {
        client.close();
      })
      
    });
    // expect.assertions(1);
  });
});
