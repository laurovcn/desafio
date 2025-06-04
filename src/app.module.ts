import { Module } from '@nestjs/common';
import { AppController, HealthController } from './app.controller';
import { DashboardModule } from './dashboard.module';
import { FarmerModule } from './farmer/farmer.module';
import { PropertyModule } from './property/property.module';
import { HarvestModule } from './harvest/harvest.module';
import { CropModule } from './crop/crop.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    FarmerModule,
    PropertyModule,
    HarvestModule,
    CropModule,
    DashboardModule,
  ],
  controllers: [AppController, HealthController],
  providers: [PrismaService],
})
export class AppModule {}
