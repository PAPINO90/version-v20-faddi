import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Augmente la limite du body parser pour accepter les images en base64
  const bodyParser = require('body-parser');
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  const configService = app.get(ConfigService);

  // Configuration pour servir les fichiers statiques (images) avec CORS
  const express = app.getHttpAdapter().getInstance();
  express.use('/uploads', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
  });
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Configuration pour servir les fichiers publics
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/',
  });

  // Configuration CORS avec NestJS built-in
  app.enableCors({
    origin: [
      'http://localhost:3001', 
      'http://127.0.0.1:5500',
      'http://localhost:5500',
      'http://127.0.0.1:5505', // Ajout pour le frontend local
      'null', // Pour les fichiers ouverts en local (file://)
      /^http:\/\/localhost:\d+$/,
      /^http:\/\/127\.0\.0\.1:\d+$/,
      /^file:\/\/.*$/
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Configuration des pipes de validation globale
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Prefix global pour l'API
  app.setGlobalPrefix('api');

  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);
  
  console.log(`🚀 API FADIDI démarrée sur http://localhost:${port}`);
  console.log(`📚 Documentation disponible sur http://localhost:${port}/api`);
}

bootstrap();