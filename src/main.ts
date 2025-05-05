import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ErrorLoggingInterceptor } from './interceptors/error-logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:5173', // Frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  });
  
  // Set global prefix
  app.setGlobalPrefix('api');
  
  // Enable validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // strip properties that don't have decorators
    transform: true, // transform payloads to DTOs
    forbidNonWhitelisted: true, // throw errors if non-whitelisted values are provided
  }));

  // Add global error logging interceptor
  app.useGlobalInterceptors(new ErrorLoggingInterceptor());
  
  await app.listen(3000);
}
bootstrap();