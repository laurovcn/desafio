import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}
}

@Controller('health')
export class HealthController {
  @Get()
  healthCheck() {
    return { status: 'ok', date: new Date().toISOString() };
  }
}
