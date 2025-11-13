"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const core_2 = require("@nestjs/core");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const transform_interceptor_1 = require("./common/interceptors/transform.interceptor");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    const reflector = app.get(core_2.Reflector);
    app.setGlobalPrefix('api');
    app.enableCors({
        origin: 'http://localhost:5173',
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
    }));
    app.useGlobalInterceptors(new common_2.ClassSerializerInterceptor(reflector), new transform_interceptor_1.TransformInterceptor());
    (0, class_validator_1.useContainer)(app.select(app_module_1.AppModule), { fallbackOnErrors: true });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Pow-er Tickets API')
        .setDescription('REST API for the Pow-er Tickets platform')
        .setVersion('1.0.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const port = configService.get('port', 3000);
    await app.listen(port);
}
bootstrap();
//# sourceMappingURL=main.js.map