// Setup para testes E2E
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL =
  process.env.DATABASE_URL || 'postgresql://test:test@localhost:5432/test_db';

// Configurar timeout global
jest.setTimeout(15000);
