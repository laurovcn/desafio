import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { FarmerService } from '../farmer/farmer.service';
import { UnauthorizedException } from '@nestjs/common';
import { Role } from './roles.enum';

const mockJwtService = {
  sign: jest.fn(),
};

const mockFarmerService = {
  findOne: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: FarmerService, useValue: mockFarmerService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user data when farmer exists', async () => {
      const mockFarmer = { id: '1', name: 'John', role: Role.FARMER };
      mockFarmerService.findOne.mockResolvedValue(mockFarmer);

      const result = await service.validateUser('1');
      expect(result).toEqual({
        id: '1',
        name: 'John',
        role: Role.FARMER,
      });
    });

    it('should throw UnauthorizedException when farmer not found', async () => {
      mockFarmerService.findOne.mockRejectedValue(new Error('Not found'));

      await expect(service.validateUser('invalid')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('login', () => {
    it('should return JWT token', async () => {
      const user = { id: '1', name: 'John', role: Role.FARMER };
      const mockToken = 'jwt.token.here';
      mockJwtService.sign.mockReturnValue(mockToken);

      const result = await service.login(user);
      expect(result).toEqual({ access_token: mockToken });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: user.id,
        name: user.name,
        role: user.role,
      });
    });
  });
});
