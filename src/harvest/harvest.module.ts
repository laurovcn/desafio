import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { HarvestController } from './harvest.controller';
import { HarvestService } from './harvest.service';

@Module({
  controllers: [HarvestController],
  providers: [HarvestService, PrismaService],
})
export class HarvestModule {}
