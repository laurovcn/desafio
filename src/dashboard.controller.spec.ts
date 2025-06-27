import { Test, TestingModule } from '@nestjs/testing';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard/dashboard.service';

describe('DashboardController', () => {
  let controller: DashboardController;
  const mockService = { getDashboard: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [{ provide: DashboardService, useValue: mockService }],
    }).compile();

    controller = module.get<DashboardController>(DashboardController);
    jest.clearAllMocks();
  });

  it('should return dashboard data', async () => {
    const data = {
      totalFarms: 1,
      totalHectares: 50,
      byState: [],
      byCrop: [],
      landUse: { arableArea: 20, vegetationArea: 30 },
    };
    mockService.getDashboard.mockResolvedValue(data);
    const result = await controller.getDashboard();
    expect(result).toEqual(data);
    expect(mockService.getDashboard).toHaveBeenCalled();
  });
});
