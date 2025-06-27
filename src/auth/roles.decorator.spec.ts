import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY, Roles } from './roles.decorator';

describe('Roles Decorator', () => {
  it('should set metadata for roles', () => {
    const roles = ['admin', 'farmer'];
    class TestClass {}
    const decorator = Roles(...roles);
    // apply decorator to class
    (decorator as ClassDecorator)(TestClass);
    expect(Reflect.getMetadata(ROLES_KEY, TestClass)).toEqual(roles);
  });
});
