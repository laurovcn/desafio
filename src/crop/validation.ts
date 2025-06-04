import { z } from 'zod';

export const CropCreateSchema = z
  .object({
    name: z.string().min(1),
    harvestId: z.string().uuid(),
  })
  .openapi({ title: 'CropCreate' });

export const CropUpdateSchema = CropCreateSchema.partial().openapi({
  title: 'CropUpdate',
});

export const PaginationQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional().default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).optional().default('20'),
});
