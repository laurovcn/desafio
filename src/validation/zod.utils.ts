import { ZodSchema, ZodError } from 'zod';
import { BadRequestException } from '@nestjs/common';

export function parseOrThrow<T>(schema: ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new BadRequestException(result.error.message);
  }
  return result.data;
}
