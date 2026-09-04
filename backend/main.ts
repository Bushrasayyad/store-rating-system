import { NestFactory } from '@nestjs/core';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { AppModule } from './app.module';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  }));
  
  app.useGlobalPipes(
    new ValidationPipe({
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
        return new BadRequestException({
          statusCode: 400,
          message: 'Validation failed',
          errors: formattedErrors,
        });
      },
    }),
  );
  
  app.setGlobalPrefix('api');
  
  await app.listen(process.env.PORT || 5000);
  console.log(`🚀 Application is running on: http://localhost:${process.env.PORT || 5000}`);
}
bootstrap();