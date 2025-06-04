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
import { PropertyService } from './property.service';
import { PropertyCreateSchema, PropertyUpdateSchema } from './validation';

@Controller('properties')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Get()
  findAll() {
    return this.propertyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propertyService.findOne(id);
  }

  @Post()
  @ApiBody({ schema: { $ref: '#/components/schemas/PropertyCreate' } })
  create(
    @Body()
    data: {
      name: string;
      city: string;
      state: string;
      totalArea: number;
      arableArea: number;
      vegetationArea: number;
      farmerId: string;
    },
  ) {
    const parsed = PropertyCreateSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error(parsed.error.message);
    }
    return this.propertyService.create(parsed.data);
  }

  @Put(':id')
  @ApiBody({ schema: { $ref: '#/components/schemas/PropertyUpdate' } })
  update(
    @Param('id') id: string,
    @Body()
    data: Partial<{
      name: string;
      city: string;
      state: string;
      totalArea: number;
      arableArea: number;
      vegetationArea: number;
      farmerId: string;
    }>,
  ) {
    const parsed = PropertyUpdateSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error(parsed.error.message);
    }
    return this.propertyService.update(id, parsed.data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.propertyService.remove(id);
  }
}
