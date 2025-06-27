import { getOpenApiRegistry } from './openapi.schemas';

describe('OpenAPI Schemas Registry', () => {
  it('should return a registry instance', () => {
    const registry1 = getOpenApiRegistry();
    expect(registry1).toBeDefined();
    const registry2 = getOpenApiRegistry();
    // registry is singleton
    expect(registry2).toBe(registry1);
  });
});
