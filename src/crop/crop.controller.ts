import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { CropService } from './crop.service';
import {
  CropCreateSchema,
  CropUpdateSchema,
  PaginationQuerySchema,
} from './validation';

@Controller('crops')
export class CropController {
  constructor(private readonly cropService: CropService) {}

  @Get()
  async findAll(@Query() query: any) {
    const parsed = PaginationQuerySchema.safeParse(query);
    if (!parsed.success) {
      throw new Error(parsed.error.message);
    }
    return this.cropService.findAll(parsed.data.page, parsed.data.limit);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.cropService.findOne(id);
  }

  @Post()
  @ApiBody({ schema: { $ref: '#/components/schemas/CropCreate' } })
  async create(@Body() data: { name: string; harvestId: string }) {
    const parsed = CropCreateSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error(parsed.error.message);
    }
    return this.cropService.create(parsed.data);
  }

  @Put(':id')
  @ApiBody({ schema: { $ref: '#/components/schemas/CropUpdate' } })
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
