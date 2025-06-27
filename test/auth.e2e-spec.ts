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

describe('Auth E2E', () => {
  let app: NestFastifyApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    // Configurar env para teste
    process.env.NODE_ENV = 'test';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(ThrottlerGuard)
      .useValue({ canActivate: () => true })
      .compile();

    const fastifyAdapter = new FastifyAdapter({ logger: false });
    app =
      moduleFixture.createNestApplication<NestFastifyApplication>(
        fastifyAdapter,
      );

    prisma = moduleFixture.get<PrismaService>(PrismaService);

    // Aguardar inicialização completa
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('/auth/login (POST)', () => {
    it('should login successfully with valid credentials', async () => {
      // Mock do findUnique para retornar usuário válido
      mockPrismaService.farmer.findUnique.mockResolvedValue({
        id: 'test-farmer-id',
        cpfCnpj: '11111111111',
        name: 'Test Farmer',
        role: Role.FARMER,
      });

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          id: 'test-farmer-id',
          password: 'any', // LocalStrategy não verifica senha real
        })
        .expect(201);

      expect(response.body).toHaveProperty('access_token');
    }, 15000);

    it('should fail with invalid credentials', async () => {
      // Mock do findUnique para retornar null (usuário não encontrado)
      mockPrismaService.farmer.findUnique.mockResolvedValue(null);

      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          id: 'invalid-id',
          password: 'any',
        })
        .expect(401);
    }, 15000);
  });
});
