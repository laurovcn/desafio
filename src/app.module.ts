import { Module } from '@nestjs/common';
import { AppController, HealthController } from './app.controller';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard.module';
import { FarmerModule } from './farmer/farmer.module';
import { PropertyModule } from './property/property.module';
import { HarvestModule } from './harvest/harvest.module';
import { CropModule } from './crop/crop.module';
import { PrismaService } from './prisma.service';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/roles.guard';
import { MetricsModule } from './metrics/metrics.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60, limit: 10 }]),
    AuthModule,
    MetricsModule,
    FarmerModule,
    PropertyModule,
    HarvestModule,
    CropModule,
    DashboardModule,
  ],
  controllers: [AppController, HealthController],
  providers: [PrismaService, { provide: APP_GUARD, useClass: RolesGuard }],
})
export class AppModule {}
