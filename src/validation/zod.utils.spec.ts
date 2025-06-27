import { z } from 'zod';
import { parseOrThrow } from './zod.utils';
import { BadRequestException } from '@nestjs/common';

describe('parseOrThrow', () => {
  const schema = z.object({ foo: z.string() });

  it('should return parsed data when valid', () => {
    const data = { foo: 'bar' };
    expect(parseOrThrow(schema, data)).toEqual(data);
  });

  it('should throw BadRequestException when invalid', () => {
    const invalidData = { foo: 123 };
    expect(() => parseOrThrow(schema, invalidData)).toThrow(
      BadRequestException,
    );
  });
});
