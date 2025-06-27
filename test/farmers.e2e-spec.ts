import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma.service';
import { Role } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { JwtAuthGuard } from '../src/auth/jwt-auth.guard';
import { RolesGuard } from '../src/auth/roles.guard';
import { ThrottlerGuard } from '@nestjs/throttler';
import { mockPrismaService } from './prisma.mock';

describe('Farmers E2E', () => {
  let app: NestFastifyApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let authToken: string;

  beforeAll(async () => {
    // Configurar env para teste
    process.env.NODE_ENV = 'test';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .compile();

    const fastifyAdapter = new FastifyAdapter({ logger: false });
    app =
      moduleFixture.createNestApplication<NestFastifyApplication>(
        fastifyAdapter,
      );

    // Desabilitar guards globalmente
    app.useGlobalGuards();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
    jwtService = moduleFixture.get<JwtService>(JwtService);

    // Aguardar inicialização completa
    await app.init();
    await app.getHttpAdapter().getInstance().ready();

    // Criar token de autenticação
    authToken = jwtService.sign({
      sub: 'test-farmer-id',
      name: 'Test Farmer',
      role: Role.FARMER,
    });
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('/farmers (GET)', () => {
    it('should return 403 without proper authentication', async () => {
      // Mock da resposta do findMany
      mockPrismaService.farmer.findMany.mockResolvedValue([]);
      mockPrismaService.farmer.count.mockResolvedValue(0);

      await request(app.getHttpServer()).get('/farmers').expect(403);
    }, 15000);
  });

  describe('/farmers (POST)', () => {
    it('should return 403 without proper authentication', async () => {
      const farmerData = {
        cpfCnpj: '12345678901',
        name: 'John Doe',
      };

      await request(app.getHttpServer())
        .post('/farmers')
        .send(farmerData)
        .expect(403);
    }, 15000);
  });
});
