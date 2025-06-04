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
import { FarmerService } from './farmer.service';
import {
  FarmerCreateSchema,
  FarmerUpdateSchema,
  PaginationQuerySchema,
} from './validation';
import { parseOrThrow } from '../validation/zod.utils';

@Controller('farmers')
export class FarmerController {
  constructor(private readonly farmerService: FarmerService) {}

  @Get()
  async findAll(@Query() query: any) {
    const parsed = PaginationQuerySchema.safeParse(query);
    if (!parsed.success) {
      throw new Error(parsed.error.message);
    }
    return this.farmerService.findAll(parsed.data.page, parsed.data.limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.farmerService.findOne(id);
  }

  @Post()
  @ApiBody({ schema: { $ref: '#/components/schemas/FarmerCreate' } })
  create(@Body() data: { cpfCnpj: string; name: string }) {
    const parsed = parseOrThrow(FarmerCreateSchema, data);
    return this.farmerService.create(parsed);
  }

  @Put(':id')
  @ApiBody({ schema: { $ref: '#/components/schemas/FarmerUpdate' } })
  update(
    @Param('id') id: string,
    @Body() data: Partial<{ cpfCnpj: string; name: string }>,
  ) {
    const parsed = parseOrThrow(FarmerUpdateSchema, data);
    return this.farmerService.update(id, parsed);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.farmerService.remove(id);
  }
}
