import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard/dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get()
  async getDashboard() {
    return this.dashboardService.getDashboard();
  }
}
