import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { HarvestService } from './harvest.service';

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
  create(@Body() data: { name: string; propertyId: string }) {
    return this.harvestService.create(data);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() data: Partial<{ name: string; propertyId: string }>,
  ) {
    return this.harvestService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.harvestService.remove(id);
  }
}
