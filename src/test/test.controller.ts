import { Body, Controller, Post } from "@nestjs/common";
import axios from "axios";

@Controller("test")
export class TestController {
  @Post("test")
  async imprimirAlgo(@Body() _parms) {
    try {
      const res = await axios.post("test/test", { nombre: "Ezequi" });
      return res.data;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}
