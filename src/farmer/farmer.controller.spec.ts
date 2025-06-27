import { Test, TestingModule } from '@nestjs/testing';
import { FarmerController } from './farmer.controller';
import { FarmerService } from './farmer.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

const mockFarmerService = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('FarmerController', () => {
  let controller: FarmerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FarmerController],
      providers: [{ provide: FarmerService, useValue: mockFarmerService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<FarmerController>(FarmerController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return farmers list', async () => {
    const mockResult = {
      items: [{ id: '1', name: 'John', cpfCnpj: '12345678901' }],
      total: 1,
      page: 1,
      limit: 20,
    };
    mockFarmerService.findAll.mockResolvedValue(mockResult);

    const result = await controller.findAll({ page: '1', limit: '20' });
    expect(result).toEqual(mockResult);
    expect(mockFarmerService.findAll).toHaveBeenCalledWith(1, 20);
  });

  it('should return a single farmer', async () => {
    const mockFarmer = { id: '1', name: 'John', cpfCnpj: '12345678901' };
    mockFarmerService.findOne.mockResolvedValue(mockFarmer);

    const result = await controller.findOne('1');
    expect(result).toEqual(mockFarmer);
    expect(mockFarmerService.findOne).toHaveBeenCalledWith('1');
  });

  it('should create a farmer', async () => {
    const farmerData = { name: 'John', cpfCnpj: '12345678901' };
    const mockCreated = { id: '1', ...farmerData };
    mockFarmerService.create.mockResolvedValue(mockCreated);

    const result = await controller.create(farmerData);
    expect(result).toEqual(mockCreated);
    expect(mockFarmerService.create).toHaveBeenCalledWith(farmerData);
  });

  it('should update a farmer', async () => {
    const updateData = { name: 'John Updated' };
    const mockUpdated = {
      id: '1',
      name: 'John Updated',
      cpfCnpj: '12345678901',
    };
    mockFarmerService.update.mockResolvedValue(mockUpdated);

    const result = await controller.update('1', updateData);
    expect(result).toEqual(mockUpdated);
    expect(mockFarmerService.update).toHaveBeenCalledWith('1', updateData);
  });

  it('should delete a farmer', async () => {
    const mockResult = { deleted: true };
    mockFarmerService.remove.mockResolvedValue(mockResult);

    const result = await controller.remove('1');
    expect(result).toEqual(mockResult);
    expect(mockFarmerService.remove).toHaveBeenCalledWith('1');
  });
});
