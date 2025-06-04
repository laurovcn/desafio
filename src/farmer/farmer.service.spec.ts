import { Test, TestingModule } from '@nestjs/testing';
import { FarmerService } from './farmer.service';
import { PrismaService } from '../prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mockPrisma = {
  farmer: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(), // Adicionado para mock de paginação
  },
};

describe('FarmerService', () => {
  let service: FarmerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FarmerService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();
    service = module.get<FarmerService>(FarmerService);
    jest.clearAllMocks();
  });

  it('should list all farmers', async () => {
    mockPrisma.farmer.findMany.mockResolvedValue([
      { id: '1', cpfCnpj: '12345678901', name: 'John', properties: [] },
    ]);
    mockPrisma.farmer.count.mockResolvedValue(1); // Adicionado para mock de paginação
    const result = await service.findAll();
    expect(result.items).toHaveLength(1);
    expect(mockPrisma.farmer.findMany).toHaveBeenCalled();
    expect(mockPrisma.farmer.count).toHaveBeenCalled();
  });

  it('should throw if farmer not found', async () => {
    mockPrisma.farmer.findUnique.mockResolvedValue(null);
    await expect(service.findOne('notfound')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should create a farmer with valid CPF', async () => {
    mockPrisma.farmer.findUnique.mockResolvedValue(null);
    mockPrisma.farmer.create.mockResolvedValue({
      id: '1',
      cpfCnpj: '12345678901',
      name: 'John',
    });
    const result = await service.create({
      cpfCnpj: '12345678901',
      name: 'John',
    });
    expect(result).toHaveProperty('id');
    expect(mockPrisma.farmer.create).toHaveBeenCalled();
  });

  it('should not create a farmer with invalid CPF', async () => {
    await expect(
      service.create({ cpfCnpj: '123', name: 'John' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should not create a farmer with duplicate CPF/CNPJ', async () => {
    mockPrisma.farmer.findUnique.mockResolvedValue({
      id: '1',
      cpfCnpj: '12345678901',
      name: 'John',
    });
    await expect(
      service.create({ cpfCnpj: '12345678901', name: 'John' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should update a farmer', async () => {
    mockPrisma.farmer.update.mockResolvedValue({
      id: '1',
      cpfCnpj: '12345678901',
      name: 'John Updated',
    });
    const result = await service.update('1', { name: 'John Updated' });
    expect(result.name).toBe('John Updated');
  });

  it('should delete a farmer', async () => {
    mockPrisma.farmer.delete.mockResolvedValue({ id: '1' });
    const result = await service.remove('1');
    expect(result).toEqual({ deleted: true });
  });
});
