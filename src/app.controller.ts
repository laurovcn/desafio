import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  getRoot() {
    return { message: 'Rural Producers Management API', version: '1.0' };
  }
}

@Controller('health')
export class HealthController {
  @Get()
  healthCheck() {
    return { status: 'ok', date: new Date().toISOString() };
  }
}
