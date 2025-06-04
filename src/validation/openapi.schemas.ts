import { OpenAPIGenerator } from 'zod-to-openapi';
import { CropCreateSchema, CropUpdateSchema } from '../crop/validation';
import { FarmerCreateSchema, FarmerUpdateSchema } from '../farmer/validation';
import {
  PropertyCreateSchema,
  PropertyUpdateSchema,
} from '../property/validation';
import {
  HarvestCreateSchema,
  HarvestUpdateSchema,
} from '../harvest/validation';

export function generateOpenApiSchemas() {
  const schemas = [
    CropCreateSchema,
    CropUpdateSchema,
    FarmerCreateSchema,
    FarmerUpdateSchema,
    PropertyCreateSchema,
    PropertyUpdateSchema,
    HarvestCreateSchema,
    HarvestUpdateSchema,
  ];
  const generator = new OpenAPIGenerator(schemas);
  return generator.generate();
}
