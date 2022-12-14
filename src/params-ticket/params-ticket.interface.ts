import { ObjectId } from "mongodb";

export interface ParamsTicketInterface {
    _id: ObjectId,
    nombreDato: "Capselera_1" | "Capselera_2",
    valorDato: string
}