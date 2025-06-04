import { z } from 'zod';

export const HarvestCreateSchema = z.object({
  name: z.string().min(1),
  propertyId: z.string().uuid(),
});

export const HarvestUpdateSchema = HarvestCreateSchema.partial();
