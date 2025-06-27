import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from './dashboard.service';
import { PrismaService } from '../prisma.service';

describe('DashboardService', () => {
  let service: DashboardService;
  const mockPrisma = {
    property: {
      count: jest.fn(),
      aggregate: jest.fn(),
      groupBy: jest.fn(),
    },
    crop: {
      groupBy: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
    jest.clearAllMocks();
  });

  it('should return dashboard metrics', async () => {
    // Mock property.count
    mockPrisma.property.count.mockResolvedValue(5);
    // First call: totalArea
    mockPrisma.property.aggregate
      .mockResolvedValueOnce({ _sum: { totalArea: 100 } })
      // Second call: land use
      .mockResolvedValueOnce({ _sum: { arableArea: 60, vegetationArea: 40 } });
    // Mock grouping
    mockPrisma.property.groupBy.mockResolvedValue([
      { state: 'CA', _count: { _all: 3 } },
    ] as any);
    mockPrisma.crop.groupBy.mockResolvedValue([
      { name: 'Wheat', _count: { _all: 10 } },
    ] as any);

    const result = await service.getDashboard();

    expect(result).toEqual({
      totalFarms: 5,
      totalHectares: 100,
      byState: [{ state: 'CA', count: 3 }],
      byCrop: [{ crop: 'Wheat', count: 10 }],
      landUse: { arableArea: 60, vegetationArea: 40 },
    });
    expect(mockPrisma.property.count).toHaveBeenCalled();
    expect(mockPrisma.property.aggregate).toHaveBeenCalledTimes(2);
    expect(mockPrisma.property.groupBy).toHaveBeenCalled();
    expect(mockPrisma.crop.groupBy).toHaveBeenCalled();
  });
});
