import { Test, TestingModule } from '@nestjs/testing';
import { AppController, HealthController } from './app.controller';

describe('AppController', () => {
  let appCtrl: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appCtrl = module.get<AppController>(AppController);
  });

  it('should return root message', () => {
    const result = appCtrl.getRoot();
    expect(result).toEqual({
      message: 'Rural Producers Management API',
      version: '1.0',
    });
  });
});

describe('HealthController', () => {
  let healthCtrl: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();

    healthCtrl = module.get<HealthController>(HealthController);
  });

  it('should return health status', () => {
    const result = healthCtrl.healthCheck();
    expect(result).toHaveProperty('status', 'ok');
    expect(result).toHaveProperty('date');
  });
});
