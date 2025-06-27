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
    count: jest.fn(),
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
    mockPrisma.harvest.count.mockResolvedValue(1);
    const result = await service.findAll();
    expect(result.items).toHaveLength(1);
    expect(mockPrisma.harvest.findMany).toHaveBeenCalled();
    expect(mockPrisma.harvest.count).toHaveBeenCalled();
  });

  it('should throw if harvest not found', async () => {
    mockPrisma.harvest.findUnique.mockResolvedValue(null);
    await expect(service.findOne('notfound')).rejects.toThrowError(
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
    await expect(
      service.create({ name: '', propertyId: '' }),
    ).rejects.toThrowError(BadRequestException);
  });

  it('should update a harvest', async () => {
    mockPrisma.harvest.update.mockResolvedValue({
      id: '1',
      name: 'Harvest Updated',
    });
    const result = await service.update('1', { name: 'Harvest Updated' });
    expect(result.name).toBe('Harvest Updated');
  });

  it('should propagate errors when update fails', async () => {
    const error = new Error('Update failed');
    mockPrisma.harvest.update.mockRejectedValue(error);
    await expect(
      service.update('1', { name: 'X', propertyId: 'p1' }),
    ).rejects.toThrow(error);
  });

  it('should delete a harvest', async () => {
    mockPrisma.harvest.delete.mockResolvedValue({ id: '1' });
    const result = await service.remove('1');
    expect(result).toEqual({ deleted: true });
  });

  it('should handle remove when delete fails', async () => {
    mockPrisma.harvest.delete.mockRejectedValue(new Error('Delete failed'));
    await expect(service.remove('1')).rejects.toThrow('Delete failed');
  });

  it('should return a harvest when found', async () => {
    const mockHarvest = { id: '1', name: 'Test', property: {}, crops: [] };
    mockPrisma.harvest.findUnique.mockResolvedValue(mockHarvest);
    const result = await service.findOne('1');
    expect(result).toEqual(mockHarvest);
    expect(mockPrisma.harvest.findUnique).toHaveBeenCalledWith({
      where: { id: '1' },
      include: { property: true, crops: true },
    });
  });

  it('should paginate results based on page and limit', async () => {
    const itemsArray = Array(3).fill({
      id: 'x',
      name: 'Item',
      property: {},
      crops: [],
    });
    mockPrisma.harvest.findMany.mockResolvedValue(itemsArray);
    mockPrisma.harvest.count.mockResolvedValue(10);
    const page = 2;
    const limit = 3;
    const result = await service.findAll(page, limit);
    expect(mockPrisma.harvest.findMany).toHaveBeenCalledWith({
      skip: (page - 1) * limit,
      take: limit,
      include: { property: true, crops: true },
    });
    expect(result).toEqual({
      items: itemsArray,
      total: 10,
      page,
      limit,
      totalPages: Math.ceil(10 / limit),
    });
  });

  it('should call findAll with default pagination', async () => {
    const itemsArray = [{ id: '1', name: 'H', property: {}, crops: [] }];
    mockPrisma.harvest.findMany.mockResolvedValue(itemsArray);
    mockPrisma.harvest.count.mockResolvedValue(1);
    const result = await service.findAll();
    expect(mockPrisma.harvest.findMany).toHaveBeenCalledWith({
      skip: 0,
      take: 20,
      include: { property: true, crops: true },
    });
    expect(result.items).toEqual(itemsArray);
  });
});
