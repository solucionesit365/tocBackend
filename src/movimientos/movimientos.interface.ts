export interface MovimientosInterface {
  _id: number;
  tipo: TiposMovientos;
  valor: number;
  concepto: string;
  idTrabajador: number;
  codigoBarras: string;
  idTicket: number;
  enviado: boolean;
}

export type TiposMovientos =
  | "EFECTIVO"
  | "TARJETA"
  | "TKRS_CON_EXCESO"
  | "TKRS_SIN_EXCESO"
  | "DEUDA"
  | "CONSUMO_PERSONAL"
  | "ENTREGA_DIARIA"
  | "ENTRADA_DINERO"
  | "DATAFONO_3G";

export interface CuentaCodigoBarras {
  _id: "CUENTA";
  ultimo: number;
}

export type FormaPago =
  | "EFECTIVO"
  | "TARJETA"
  | "TKRS"
  | "CONSUMO_PERSONAL"
  | "DEUDA";
