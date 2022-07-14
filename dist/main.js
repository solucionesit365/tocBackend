"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const platform_fastify_1 = require("@nestjs/platform-fastify");
const axios_1 = require("axios");
require('./sincro');
axios_1.default.defaults.baseURL = 'https://sanpedro.cloud';
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_fastify_1.FastifyAdapter(), { cors: {
            origin: true,
            credentials: true
        } });
    await app.listen(3000, "10.137.0.201");
    await app.listen(3000, "10.137.0.243");
}
bootstrap();
//# sourceMappingURL=main.js.map