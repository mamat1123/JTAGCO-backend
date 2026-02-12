import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ErrorLoggingInterceptor } from './interceptors/error-logging.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:4173',
      'https://jtagco.vercel.app',
    ], // Frontend URLs
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  });

  // Set global prefix
  app.setGlobalPrefix('api');

  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip properties that don't have decorators
      transform: true, // transform payloads to DTOs
      forbidNonWhitelisted: true, // throw errors if non-whitelisted values are provided
    }),
  );

  // Add global error logging interceptor
  app.useGlobalInterceptors(new ErrorLoggingInterceptor());

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('JTAGCO API')
    .setDescription('The JTAGCO API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
}
bootstrap();
