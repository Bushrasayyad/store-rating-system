"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const cors_1 = __importDefault(require("cors"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use((0, cors_1.default)({
        origin: ['http://localhost:3000', 'http://localhost:3001'],
        credentials: true,
    }));
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        exceptionFactory: (errors) => {
            const formattedErrors = errors.reduce((acc, error) => {
                const constraints = error.constraints;
                const messages = Object.values(constraints);
                acc[error.property] = messages;
                return acc;
            }, {});
            return new common_1.BadRequestException({
                statusCode: 400,
                message: 'Validation failed',
                errors: formattedErrors,
            });
        },
    }));
    app.setGlobalPrefix('api');
    await app.listen(process.env.PORT || 5000);
    console.log(`🚀 Application is running on: http://localhost:${process.env.PORT || 5000}`);
}
bootstrap();
//# sourceMappingURL=main.js.map