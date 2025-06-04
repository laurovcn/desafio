import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CropController } from './crop.controller';
import { CropService } from './crop.service';

@Module({
  controllers: [CropController],
  providers: [CropService, PrismaService],
})
export class CropModule {}
