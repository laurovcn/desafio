import { UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  beforeEach(() => {
    guard = new JwtAuthGuard();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should throw UnauthorizedException when handleRequest receives no user', () => {
    expect(() => (guard as any).handleRequest(null, null, null)).toThrow(
      UnauthorizedException,
    );
  });

  it('should return user when handleRequest receives a valid user', () => {
    const user = { userId: '1', username: 'test' };
    const result = (guard as any).handleRequest(null, user, null);
    expect(result).toEqual(user);
  });
});
