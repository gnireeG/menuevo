import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: process.env.WEB_ORIGIN ?? 'http://localhost:3000',
    credentials: true,
  });

  // Wirft Fehler bei unbekannten Feldern & wandelt Payloads gemäß DTO-Typen um.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');

  // Aus dieser Spec generiert `packages/shared-types` den typsicheren
  // TanStack-Query-Client für apps/web (siehe orval.config.ts).
  const swaggerConfig = new DocumentBuilder()
    .setTitle('MenuEvo API')
    .setVersion('0.0.1')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document); // -> /docs (UI) + /docs-json
  // Zusätzlich unter /api-json bereitstellen, weil orval.config.ts darauf zeigt
  // und der globale Prefix 'api' sonst mit reingerechnet würde.
  app.getHttpAdapter().get('/api-json', (_req, res) => res.json(document));

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`API läuft auf http://localhost:${port}/api`);
  console.log(`Swagger UI auf http://localhost:${port}/docs`);
}
await bootstrap();
