import { z } from 'zod';

export const FarmerCreateSchema = z.object({
  cpfCnpj: z.string().min(11).max(14),
  name: z.string().min(1),
});

export const FarmerUpdateSchema = z.object({
  cpfCnpj: z.string().min(11).max(14).optional(),
  name: z.string().min(1).optional(),
});
