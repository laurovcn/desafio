import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { getOpenApiRegistry } from './validation/openapi.schemas';
import { OpenApiGeneratorV31 } from '@asteasolutions/zod-to-openapi';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      logger: WinstonModule.createLogger({
        transports: [
          new winston.transports.Console({
            format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.simple(),
            ),
          }),
        ],
      }),
    },
  );

  if (process.env.NODE_ENV !== 'test') {
    await app.register(require('@fastify/helmet'));
    await app.register(require('@fastify/cors'), {
      origin: '*',
    });
  }

  const config = new DocumentBuilder()
    .setTitle('Rural Producers Management')
    .setDescription('API for managing farmers, properties, harvests, and crops')
    .setVersion('1.0')
    .build();

  const registry = getOpenApiRegistry();
  const generator = new OpenApiGeneratorV31(registry.definitions);
  const openApiDoc = generator.generateDocument({
    openapi: '3.1.0',
    info: {
      title: 'Rural Producers Management',
      version: '1.0',
      description: 'API for managing farmers, properties, harvests, and crops',
    },
  });
  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
  });
  (document.components as any).schemas = openApiDoc.components?.schemas;
  if (process.env.NODE_ENV !== 'production') {
    SwaggerModule.setup('api', app, document);
  }

  const fastify = app.getHttpAdapter().getInstance();
  fastify.get('/routes', async (request, reply) => {
    reply.type('text/plain');
    reply.send(fastify.printRoutes());
  });

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
