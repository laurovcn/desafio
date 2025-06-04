import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { CropService } from './crop.service';
import { CropCreateSchema, CropUpdateSchema } from '../validation/zod.dto';

@Controller('crops')
export class CropController {
  constructor(private readonly cropService: CropService) {}

  @Get()
  async findAll() {
    return this.cropService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.cropService.findOne(id);
  }

  @Post()
  async create(@Body() data: { name: string; harvestId: string }) {
    const parsed = CropCreateSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error(parsed.error.message);
    }
    return this.cropService.create(parsed.data);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<{ name: string; harvestId: string }>,
  ) {
    const parsed = CropUpdateSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error(parsed.error.message);
    }
    return this.cropService.update(id, parsed.data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.cropService.remove(id);
  }
}
