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
import { PropertyService } from './property.service';
import {
  PropertyCreateSchema,
  PropertyUpdateSchema,
  PaginationQuerySchema,
} from './validation';
import { parseOrThrow } from '../validation/zod.utils';

@Controller('properties')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Get()
  async findAll(@Query() query: any) {
    const parsed = PaginationQuerySchema.safeParse(query);
    if (!parsed.success) {
      throw new Error(parsed.error.message);
    }
    return this.propertyService.findAll(parsed.data.page, parsed.data.limit);
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
    const parsed = parseOrThrow(PropertyCreateSchema, data);
    return this.propertyService.create(parsed);
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
    const parsed = parseOrThrow(PropertyUpdateSchema, data);
    return this.propertyService.update(id, parsed);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.propertyService.remove(id);
  }
}
