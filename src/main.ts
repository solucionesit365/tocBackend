import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import axios from "axios";
require("./sincro");
require("./sockets.gateway");
 axios.defaults.baseURL = 'http://localhost:3001';
// axios.defaults.baseURL = "https://sanpedro.cloud";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      cors: {
        origin: true,
        credentials: true,
      },
    }
  );
  // app.enableCors();
  await app.listen(3000);
  // await app.listen(3000,"10.137.0.201"); //para iterum ubuntu
  // await app.listen(3000,"10.137.0.243"); //para iterum windows
}
bootstrap();
