import { conexion } from "../conexion/mongodb";
import { CajaClase } from "../caja/caja.clase";

describe("Caja", () => {
  const cajaInstance = new CajaClase();

  // it("should be defined", () => {
  //   expect(cajaInstance).toBeDefined();
  // });

  it("getInfoCajaAbierta()", async () => {
    const cajaAbierta = await cajaInstance.getInfoCajaAbierta();
    expect(cajaAbierta.inicioTime).toBeDefined();
    expect(typeof cajaAbierta.inicioTime).toBe("number");

    expect(cajaAbierta.totalApertura).toBeDefined();
    expect(typeof cajaAbierta.totalApertura).toBe("number");

    expect(cajaAbierta.detalleApertura).toBeDefined();
    expect(cajaAbierta.detalleApertura.length).toBe(15);

    expect(cajaAbierta.idDependientaApertura).toBeDefined();
    expect(typeof cajaAbierta.idDependientaApertura).toBe("number");
    expect(cajaAbierta.idDependientaApertura).toBeGreaterThan(0);
  });
});
