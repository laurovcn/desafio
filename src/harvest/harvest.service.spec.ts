import { Test, TestingModule } from '@nestjs/testing';
import { HarvestService } from './harvest.service';
import { PrismaService } from '../prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mockPrisma = {
  harvest: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(), // Adicionado para mock de paginação
  },
};

describe('HarvestService', () => {
  let service: HarvestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HarvestService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();
    service = module.get<HarvestService>(HarvestService);
    jest.clearAllMocks();
  });

  it('should list all harvests', async () => {
    mockPrisma.harvest.findMany.mockResolvedValue([
      { id: '1', name: 'Harvest', property: {}, crops: [] },
    ]);
    mockPrisma.harvest.count.mockResolvedValue(1); // Adicionado para mock de paginação
    const result = await service.findAll();
    expect(result.items).toHaveLength(1);
    expect(mockPrisma.harvest.findMany).toHaveBeenCalled();
    expect(mockPrisma.harvest.count).toHaveBeenCalled();
  });

  it('should throw if harvest not found', async () => {
    mockPrisma.harvest.findUnique.mockResolvedValue(null);
    await expect(service.findOne('notfound')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should create a harvest with valid data', async () => {
    mockPrisma.harvest.create.mockResolvedValue({ id: '1', name: 'Harvest' });
    const result = await service.create({ name: 'Harvest', propertyId: 'p1' });
    expect(result).toHaveProperty('id');
    expect(mockPrisma.harvest.create).toHaveBeenCalled();
  });

  it('should not create a harvest with missing data', async () => {
    await expect(service.create({ name: '', propertyId: '' })).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should update a harvest', async () => {
    mockPrisma.harvest.update.mockResolvedValue({
      id: '1',
      name: 'Harvest Updated',
    });
    const result = await service.update('1', { name: 'Harvest Updated' });
    expect(result.name).toBe('Harvest Updated');
  });

  it('should delete a harvest', async () => {
    mockPrisma.harvest.delete.mockResolvedValue({ id: '1' });
    const result = await service.remove('1');
    expect(result).toEqual({ deleted: true });
  });
});
