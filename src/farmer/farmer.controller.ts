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
import { FarmerService } from './farmer.service';
import { FarmerCreateSchema, FarmerUpdateSchema } from './validation';

@Controller('farmers')
export class FarmerController {
  constructor(private readonly farmerService: FarmerService) {}

  @Get()
  findAll() {
    return this.farmerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.farmerService.findOne(id);
  }

  @Post()
  @ApiBody({ schema: { $ref: '#/components/schemas/FarmerCreate' } })
  create(@Body() data: { cpfCnpj: string; name: string }) {
    const parsed = FarmerCreateSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error(parsed.error.message);
    }
    return this.farmerService.create(parsed.data);
  }

  @Put(':id')
  @ApiBody({ schema: { $ref: '#/components/schemas/FarmerUpdate' } })
  update(
    @Param('id') id: string,
    @Body() data: Partial<{ cpfCnpj: string; name: string }>,
  ) {
    const parsed = FarmerUpdateSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error(parsed.error.message);
    }
    return this.farmerService.update(id, parsed.data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.farmerService.remove(id);
  }
}
