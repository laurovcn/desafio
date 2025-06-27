import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

describe('AuthController', () => {
  let controller: AuthController;
  const mockAuthService = { login: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    })
      .overrideGuard(LocalAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AuthController>(AuthController);
    jest.clearAllMocks();
  });

  it('should call authService.login with req.user and return token', async () => {
    const user = { id: '1', name: 'John', role: 'FARMER' };
    const tokenResponse = { access_token: 'abc' };
    mockAuthService.login.mockResolvedValue(tokenResponse);

    // Simulate request object
    const result = await controller.login({ user });
    expect(mockAuthService.login).toHaveBeenCalledWith(user);
    expect(result).toEqual(tokenResponse);
  });
});
