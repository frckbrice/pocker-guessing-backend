import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import compression = require('compression');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn'],
  });

  const configService = app.get(ConfigService);
  const corsOrigins = configService.get<string>('CORS_ORIGIN');
  const corsOriginList = corsOrigins
    ? corsOrigins
      .split(',')
      .map((origin) => origin.trim().replace(/\/$/, ''))
      .filter(Boolean)
    : ['http://localhost:3000'];

  const isOriginAllowed = (requestOrigin?: string) => {
    if (!requestOrigin) {
      return true;
    }

    const normalizedOrigin = requestOrigin.replace(/\/$/, '');

    return corsOriginList.some((allowedOrigin) => {
      if (allowedOrigin.startsWith('*.')) {
        const wildcardBase = allowedOrigin.slice(2);
        return (
          normalizedOrigin === `https://${wildcardBase}` ||
          normalizedOrigin.endsWith(`.${wildcardBase}`)
        );
      }

      return normalizedOrigin === allowedOrigin;
    });
  };

  app.enableCors({
    origin: (origin, callback) => {
      if (isOriginAllowed(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
  });
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(compression());
  app.getHttpAdapter().getInstance().set('trust proxy', 1);
  app.enableShutdownHooks();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const port = configService.get<number>('PORT') || 5001;
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
