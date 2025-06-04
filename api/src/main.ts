import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { raw } from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS pour autoriser le frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  });

  // Middleware pour les webhooks Stripe (raw body nécessaire pour la signature)
  app.use('/webhooks/stripe', raw({ type: 'application/json' }));

  // Validation globale
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api', { exclude: ['/webhooks/stripe'] });

  const port = process.env.PORT || 8000;
  await app.listen(port);
  console.log(`🚀 API démarrée sur le port ${port}`);
}

bootstrap();
