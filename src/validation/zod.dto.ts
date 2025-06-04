import { z } from 'zod';

export const FarmerCreateSchema = z.object({
  cpfCnpj: z.string().min(11).max(14),
  name: z.string().min(1),
});

export const FarmerUpdateSchema = z.object({
  cpfCnpj: z.string().min(11).max(14).optional(),
  name: z.string().min(1).optional(),
});

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

export const HarvestCreateSchema = z.object({
  name: z.string().min(1),
  propertyId: z.string().uuid(),
});

export const HarvestUpdateSchema = HarvestCreateSchema.partial();

export const CropCreateSchema = z.object({
  name: z.string().min(1),
  harvestId: z.string().uuid(),
});

export const CropUpdateSchema = CropCreateSchema.partial();
