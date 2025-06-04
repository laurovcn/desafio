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
});
