import { Test, TestingModule } from '@nestjs/testing';
import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';

describe('MetricsController', () => {
  let controller: MetricsController;
  const mockService = { getMetrics: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetricsController],
      providers: [{ provide: MetricsService, useValue: mockService }],
    }).compile();

    controller = module.get<MetricsController>(MetricsController);
    jest.clearAllMocks();
  });

  it('should return metrics string with header', async () => {
    const mockMetrics = 'metric_data';
    mockService.getMetrics.mockResolvedValue(mockMetrics);
    const result = await controller.getMetrics();
    expect(mockService.getMetrics).toHaveBeenCalled();
    expect(result).toBe(mockMetrics);
  });
});
