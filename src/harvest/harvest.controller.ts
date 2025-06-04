import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { HarvestService } from './harvest.service';
import { HarvestCreateSchema, HarvestUpdateSchema } from './validation';

@Controller('harvests')
export class HarvestController {
  constructor(private readonly harvestService: HarvestService) {}

  @Get()
  findAll() {
    return this.harvestService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.harvestService.findOne(id);
  }

  @Post()
  @ApiBody({ schema: { $ref: '#/components/schemas/HarvestCreate' } })
  create(@Body() data: { name: string; propertyId: string }) {
    const parsed = HarvestCreateSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error(parsed.error.message);
    }
    return this.harvestService.create(parsed.data);
  }

  @Put(':id')
  @ApiBody({ schema: { $ref: '#/components/schemas/HarvestUpdate' } })
  update(
    @Param('id') id: string,
    @Body() data: Partial<{ name: string; propertyId: string }>,
  ) {
    const parsed = HarvestUpdateSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error(parsed.error.message);
    }
    return this.harvestService.update(id, parsed.data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.harvestService.remove(id);
  }
}
