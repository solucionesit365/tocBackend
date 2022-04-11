import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import axios from 'axios';
require('./sincro');

// axios.defaults.baseURL = 'http://localhost:3001';
axios.defaults.baseURL = (process.argv[2] === 'modoServer') ? ('http://localhost:3001') : ('http://34.78.247.153:3001'); // NORMAL

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule, 
    new FastifyAdapter(),
    { cors: {
    origin: true,
    credentials: true
  }});
  // app.enableCors();
  await app.listen(3000);
}
bootstrap();
