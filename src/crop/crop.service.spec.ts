import { Test, TestingModule } from '@nestjs/testing';
import { CropService } from './crop.service';
import { PrismaService } from '../prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mockPrisma = {
  crop: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
};

describe('CropService', () => {
  let service: CropService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CropService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();
    service = module.get<CropService>(CropService);
    jest.clearAllMocks();
  });

  it('should list all crops', async () => {
    mockPrisma.crop.findMany.mockResolvedValue([
      { id: '1', name: 'Soy', harvest: {} },
    ]);
    mockPrisma.crop.count.mockResolvedValue(1);
    const result = await service.findAll();
    expect(result.items).toHaveLength(1);
    expect(mockPrisma.crop.findMany).toHaveBeenCalled();
    expect(mockPrisma.crop.count).toHaveBeenCalled();
  });

  it('should throw if crop not found', async () => {
    mockPrisma.crop.findUnique.mockResolvedValue(null);
    await expect(service.findOne('notfound')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should create a crop with valid data', async () => {
    mockPrisma.crop.create.mockResolvedValue({ id: '1', name: 'Soy' });
    const result = await service.create({ name: 'Soy', harvestId: 'h1' });
    expect(result).toHaveProperty('id');
    expect(mockPrisma.crop.create).toHaveBeenCalled();
  });

  it('should not create a crop with missing data', async () => {
    await expect(service.create({ name: '', harvestId: '' })).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should update a crop', async () => {
    mockPrisma.crop.update.mockResolvedValue({ id: '1', name: 'Soy Updated' });
    const result = await service.update('1', { name: 'Soy Updated' });
    expect(result.name).toBe('Soy Updated');
  });

  it('should delete a crop', async () => {
    mockPrisma.crop.delete.mockResolvedValue({ id: '1' });
    const result = await service.remove('1');
    expect(result).toEqual({ deleted: true });
  });

  it('should return a crop when found', async () => {
    const mockCrop = { id: '1', name: 'Test', harvest: {} };
    mockPrisma.crop.findUnique.mockResolvedValue(mockCrop);
    const result = await service.findOne('1');
    expect(result).toEqual(mockCrop);
    expect(mockPrisma.crop.findUnique).toHaveBeenCalledWith({
      where: { id: '1' },
      include: { harvest: true },
    });
  });

  it('should paginate results based on page and limit', async () => {
    const itemsArray = Array(5).fill({ id: 'x', name: 'Item', harvest: {} });
    mockPrisma.crop.findMany.mockResolvedValue(itemsArray);
    mockPrisma.crop.count.mockResolvedValue(15);
    const page = 3;
    const limit = 5;
    const result = await service.findAll(page, limit);
    expect(mockPrisma.crop.findMany).toHaveBeenCalledWith({
      skip: (page - 1) * limit,
      take: limit,
      include: { harvest: true },
    });
    expect(result).toEqual({
      items: itemsArray,
      total: 15,
      page,
      limit,
      totalPages: Math.ceil(15 / limit),
    });
  });

  it('should call findAll with default pagination', async () => {
    const items = [{ id: '1', name: 'Crop', harvest: {} }];
    mockPrisma.crop.findMany.mockResolvedValue(items);
    mockPrisma.crop.count.mockResolvedValue(1);
    const result = await service.findAll();
    expect(mockPrisma.crop.findMany).toHaveBeenCalledWith({
      skip: 0,
      take: 20,
      include: { harvest: true },
    });
    expect(result.items).toEqual(items);
  });
});
