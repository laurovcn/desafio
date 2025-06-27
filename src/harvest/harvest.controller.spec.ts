import { Test, TestingModule } from '@nestjs/testing';
import { HarvestController } from './harvest.controller';
import { HarvestService } from './harvest.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { ExecutionContext, CanActivate } from '@nestjs/common';

describe('HarvestController', () => {
  let controller: HarvestController;
  const mockService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };
  const mockAuthGuard: CanActivate = {
    canActivate: (_: ExecutionContext) => true,
  };
  const mockRolesGuard: CanActivate = {
    canActivate: (_: ExecutionContext) => true,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HarvestController],
      providers: [{ provide: HarvestService, useValue: mockService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockAuthGuard)
      .overrideGuard(RolesGuard)
      .useValue(mockRolesGuard)
      .compile();

    controller = module.get<HarvestController>(HarvestController);
    jest.clearAllMocks();
  });

  it('should list with parsed page and limit', async () => {
    const expected = { items: [], total: 0, page: 2, limit: 3, totalPages: 0 };
    mockService.findAll.mockResolvedValue(expected);
    const result = await controller.findAll({ page: '2', limit: '3' });
    expect(mockService.findAll).toHaveBeenCalledWith(2, 3);
    expect(result).toEqual(expected);
  });

  it('should throw on invalid query', async () => {
    await expect(controller.findAll({ page: 'x', limit: 'y' })).rejects.toThrow(
      Error,
    );
  });

  it('should return one', async () => {
    const obj = { id: '1' };
    mockService.findOne.mockResolvedValue(obj);
    const result = await controller.findOne('1');
    expect(mockService.findOne).toHaveBeenCalledWith('1');
    expect(result).toEqual(obj);
  });

  it('should create a harvest', async () => {
    const validUuid = '11111111-1111-1111-1111-111111111111';
    const dto = { name: 'H', propertyId: validUuid };
    const created = { id: '1', ...dto };
    mockService.create.mockResolvedValue(created);
    const result = await controller.create(dto);
    expect(mockService.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(created);
  });

  it('should update a harvest', async () => {
    const dto = { name: 'U' };
    const updated = { id: '1', name: 'U' };
    mockService.update.mockResolvedValue(updated);
    const result = await controller.update('1', dto);
    expect(mockService.update).toHaveBeenCalledWith('1', dto);
    expect(result).toEqual(updated);
  });

  it('should remove a harvest', async () => {
    const removed = { deleted: true };
    mockService.remove.mockResolvedValue(removed);
    const result = await controller.remove('1');
    expect(mockService.remove).toHaveBeenCalledWith('1');
    expect(result).toEqual(removed);
  });
});
