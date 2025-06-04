import { z } from 'zod';

export const PropertyCreateSchema = z.object({
  name: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  totalArea: z.number(),
  arableArea: z.number(),
  vegetationArea: z.number(),
  farmerId: z.string().uuid(),
});

export const PropertyUpdateSchema = PropertyCreateSchema.partial();
