import { Module } from '@nestjs/common';
import { AppController, HealthController } from './app.controller';
import { DashboardController } from './dashboard.controller';
import { FarmerModule } from './farmer/farmer.module';
import { PropertyModule } from './property/property.module';
import { HarvestModule } from './harvest/harvest.module';
import { CropModule } from './crop/crop.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [FarmerModule, PropertyModule, HarvestModule, CropModule],
  controllers: [AppController, HealthController, DashboardController],
  providers: [PrismaService],
})
export class AppModule {}
