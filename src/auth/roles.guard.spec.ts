import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Partial<Reflector>;

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    };
    guard = new RolesGuard(reflector as Reflector);
  });

  it('should allow when no roles metadata is set', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(undefined);
    const handler = () => {};
    const clazz = class {};
    const context = {
      getHandler: () => handler,
      getClass: () => clazz,
      switchToHttp: () => ({ getRequest: () => ({}) }),
    } as any as ExecutionContext;
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should allow when user has required role', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(['admin']);
    const handler = () => {};
    const clazz = class {};
    const context = {
      getHandler: () => handler,
      getClass: () => clazz,
      switchToHttp: () => ({ getRequest: () => ({ user: { role: 'admin' } }) }),
    } as any as ExecutionContext;
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should deny when user does not have required role', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(['admin']);
    const handler = () => {};
    const clazz = class {};
    const context = {
      getHandler: () => handler,
      getClass: () => clazz,
      switchToHttp: () => ({
        getRequest: () => ({ user: { role: 'farmer' } }),
      }),
    } as any as ExecutionContext;
    expect(guard.canActivate(context)).toBe(false);
  });

  it('should deny when no user is present', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(['admin']);
    const handler = () => {};
    const clazz = class {};
    const context = {
      getHandler: () => handler,
      getClass: () => clazz,
      switchToHttp: () => ({ getRequest: () => ({}) }),
    } as any as ExecutionContext;
    expect(guard.canActivate(context)).toBe(false);
  });
});
