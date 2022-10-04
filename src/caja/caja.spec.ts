import { ObjectId } from "mongodb";
import { CajaClase } from "../caja/caja.clase";
import { CajaSincro } from "./caja.interface";
import { conexion } from "../conexion/mongodb";

describe("Caja", () => {
  const cajaInstance = new CajaClase();

  it("getInfoCajaAbierta()", async () => {
    const cajaAbierta = await cajaInstance.getInfoCajaAbierta();

    expect(cajaAbierta.inicioTime).toBeDefined();
    expect(cajaAbierta.totalApertura).toBeDefined();
    expect(cajaAbierta.detalleApertura).toBeDefined();
    expect(cajaAbierta.idDependientaApertura).toBeDefined();
  });

  it("cajaAbierta()", async () => {
    const cajaAbierta = await cajaInstance.getInfoCajaAbierta();
    const resultado = await cajaInstance.cajaAbierta();
    if (cajaAbierta.inicioTime) {
      expect(resultado).toBeTruthy();
    } else {
      expect(resultado).toBeFalsy();
    }
  });

  it("confirmarCajaEnviada()", async () => {
    const cajaTest: CajaSincro = {
      _id: new ObjectId(),
      calaixFetZ: 0,
      descuadre: 0,
      detalleApertura: null,
      detalleCierre: null,
      enviado: false,
      finalTime: 654321,
      idDependientaApertura: null,
      idDependientaCierre: null,
      inicioTime: null,
      mediaTickets: null,
      nClientes: null,
      primerTicket: null,
      recaudado: null,
      totalApertura: null,
      totalCierre: null,
      totalConsumoPersonal: null,
      totalDatafono3G: null,
      totalDeuda: null,
      totalEfectivo: null,
      totalEntradas: null,
      totalSalidas: null,
      totalTarjeta: null,
      totalTkrsConExceso: null,
      totalTkrsSinExceso: null,
      ultimoTicket: null
    };
    const database = (await conexion).db("tocgame");
    const sincroCajas = database.collection<CajaSincro>("sincro-cajas");
    if ((await sincroCajas.insertOne(cajaTest)).acknowledged) {
      if (await cajaInstance.confirmarCajaEnviada(cajaTest._id)) {
        const getCaja = await sincroCajas.findOne({ _id: cajaTest._id });
        expect(getCaja.enviado).toBe(true);
        
      } else {
        throw Error("Error en el test confirmarCajaEnviada() Parte 2");
      }
    } else {
      throw Error("Error en el test confirmarCajaEnviada()");
    }
    await sincroCajas.deleteOne({_id: cajaTest._id});
  });
});
