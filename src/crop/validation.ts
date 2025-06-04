import { z } from 'zod';

export const CropCreateSchema = z.object({
  name: z.string().min(1),
  harvestId: z.string().uuid(),
});

export const CropUpdateSchema = CropCreateSchema.partial();
