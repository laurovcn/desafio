import { Test, TestingModule } from '@nestjs/testing';
import { PropertyService } from './property.service';
import { PrismaService } from '../prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mockPrisma = {
  property: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
};

describe('PropertyService', () => {
  let service: PropertyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PropertyService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();
    service = module.get<PropertyService>(PropertyService);
    jest.clearAllMocks();
  });

  it('should list all properties', async () => {
    mockPrisma.property.findMany.mockResolvedValue([
      { id: '1', name: 'Farm', farmer: {}, harvests: [] },
    ]);
    mockPrisma.property.count.mockResolvedValue(1);
    const result = await service.findAll();
    expect(result.items).toHaveLength(1);
    expect(mockPrisma.property.findMany).toHaveBeenCalled();
    expect(mockPrisma.property.count).toHaveBeenCalled();
  });

  it('should throw if property not found', async () => {
    mockPrisma.property.findUnique.mockResolvedValue(null);
    await expect(service.findOne('notfound')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should create a property with valid areas', async () => {
    mockPrisma.property.create.mockResolvedValue({ id: '1', name: 'Farm' });
    const result = await service.create({
      name: 'Farm',
      city: 'City',
      state: 'State',
      totalArea: 100,
      arableArea: 60,
      vegetationArea: 40,
      farmerId: 'f1',
    });
    expect(result).toHaveProperty('id');
    expect(mockPrisma.property.create).toHaveBeenCalled();
  });

  it('should not create a property with invalid areas', async () => {
    await expect(
      service.create({
        name: 'Farm',
        city: 'City',
        state: 'ST',
        totalArea: 50,
        arableArea: 30,
        vegetationArea: 30,
        farmerId: 'f1',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should update a property', async () => {
    mockPrisma.property.update.mockResolvedValue({
      id: '1',
      name: 'Farm Updated',
    });
    const result = await service.update('1', { name: 'Farm Updated' });
    expect(result.name).toBe('Farm Updated');
  });

  it('should throw BadRequestException when update has invalid areas', async () => {
    await expect(
      service.update('1', {
        totalArea: 50,
        arableArea: 30,
        vegetationArea: 30,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should delete a property', async () => {
    mockPrisma.property.delete.mockResolvedValue({ id: '1' });
    const result = await service.remove('1');
    expect(result).toEqual({ deleted: true });
  });

  it('should return a property when found', async () => {
    const mockProp = { id: '1', name: 'Farm', farmer: {}, harvests: [] };
    mockPrisma.property.findUnique.mockResolvedValue(mockProp);
    const result = await service.findOne('1');
    expect(result).toEqual(mockProp);
    expect(mockPrisma.property.findUnique).toHaveBeenCalledWith({
      where: { id: '1' },
      include: { farmer: true, harvests: true },
    });
  });

  it('should paginate properties based on page and limit', async () => {
    const items = Array(4).fill({
      id: 'x',
      name: 'Farm',
      farmer: {},
      harvests: [],
    });
    mockPrisma.property.findMany.mockResolvedValue(items);
    mockPrisma.property.count.mockResolvedValue(20);
    const page = 3;
    const limit = 4;
    const result = await service.findAll(page, limit);
    expect(mockPrisma.property.findMany).toHaveBeenCalledWith({
      skip: (page - 1) * limit,
      take: limit,
      include: { farmer: true, harvests: true },
    });
    expect(result).toEqual({
      items,
      total: 20,
      page,
      limit,
      totalPages: Math.ceil(20 / limit),
    });
  });
});
