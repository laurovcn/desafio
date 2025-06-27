import { z } from 'zod';
import { extendZodWithOpenApi } from 'zod-openapi';

// Estender Zod com OpenAPI globalmente
extendZodWithOpenApi(z);

export { z };
