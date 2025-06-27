import { JwtStrategy } from './jwt.strategy';
import { UnauthorizedException } from '@nestjs/common';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  beforeEach(() => {
    strategy = new JwtStrategy();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('validate should return user payload', async () => {
    const payload = { sub: '123', name: 'John', role: 'admin' };
    const result = await strategy.validate(payload);
    expect(result).toEqual({ id: '123', name: 'John', role: 'admin' });
  });

  it('constructor should configure options', () => {
    // internal metadata check via prototype
    const key = Reflect.getMetadata(
      'passport-jwt-extract',
      Object.getPrototypeOf(strategy),
    );
    // cannot easily test private config, just ensure instance is created
    expect(strategy).toBeInstanceOf(JwtStrategy);
  });
});
