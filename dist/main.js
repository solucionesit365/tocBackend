"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const platform_fastify_1 = require("@nestjs/platform-fastify");
const axios_1 = require("axios");
require('./sincro');
axios_1.default.defaults.baseURL = (process.argv[2] === 'modoServer') ? ('http://localhost:3001') : ('http://34.78.247.153:3001');
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_fastify_1.FastifyAdapter(), { cors: {
            origin: true,
            credentials: true
        } });
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map