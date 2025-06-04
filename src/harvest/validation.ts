import { z } from 'zod';

export const HarvestCreateSchema = z.object({
  name: z.string().min(1),
  propertyId: z.string().uuid(),
});

export const HarvestUpdateSchema = HarvestCreateSchema.partial();

export const PaginationQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional().default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).optional().default('20'),
});
