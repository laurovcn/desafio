import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
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

const registry = new OpenAPIRegistry();

registry.register('CropCreate', CropCreateSchema);
registry.register('CropUpdate', CropUpdateSchema);
registry.register('FarmerCreate', FarmerCreateSchema);
registry.register('FarmerUpdate', FarmerUpdateSchema);
registry.register('PropertyCreate', PropertyCreateSchema);
registry.register('PropertyUpdate', PropertyUpdateSchema);
registry.register('HarvestCreate', HarvestCreateSchema);
registry.register('HarvestUpdate', HarvestUpdateSchema);

export function getOpenApiRegistry() {
  return registry;
}
