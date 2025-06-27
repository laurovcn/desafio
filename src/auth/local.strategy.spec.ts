import { LocalStrategy } from './local.strategy';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('LocalStrategy', () => {
  let localStrategy: LocalStrategy;
  const mockAuthService = { validateUser: jest.fn() };

  beforeEach(() => {
    localStrategy = new LocalStrategy(mockAuthService as any);
    jest.clearAllMocks();
  });

  it('should validate and return user when authService returns user', async () => {
    const user = { id: '1', name: 'Test', role: 'FARMER' };
    mockAuthService.validateUser.mockResolvedValue(user);
    const result = await localStrategy.validate('1', 'password');
    expect(mockAuthService.validateUser).toHaveBeenCalledWith('1');
    expect(result).toEqual(user);
  });

  it('should throw UnauthorizedException if authService returns null or throws', async () => {
    mockAuthService.validateUser.mockRejectedValue(new Error('fail'));
    await expect(localStrategy.validate('1', 'pw')).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
