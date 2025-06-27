import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { FarmerController } from './farmer.controller';
import { FarmerService } from './farmer.service';

@Module({
  controllers: [FarmerController],
  providers: [FarmerService, PrismaService],
  exports: [FarmerService],
})
export class FarmerModule {}
