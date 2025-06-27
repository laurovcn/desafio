import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { HarvestService } from './harvest.service';
import {
  HarvestCreateSchema,
  HarvestUpdateSchema,
  PaginationQuerySchema,
} from './validation';
import { parseOrThrow } from '../validation/zod.utils';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';

@Controller('harvests')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.FARMER)
export class HarvestController {
  constructor(private readonly harvestService: HarvestService) {}

  @Get()
  async findAll(@Query() query: any) {
    const parsed = PaginationQuerySchema.safeParse(query);
    if (!parsed.success) {
      throw new Error(parsed.error.message);
    }
    return this.harvestService.findAll(parsed.data.page, parsed.data.limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.harvestService.findOne(id);
  }

  @Post()
  @ApiBody({ schema: { $ref: '#/components/schemas/HarvestCreate' } })
  create(@Body() data: { name: string; propertyId: string }) {
    const parsed = parseOrThrow(HarvestCreateSchema, data);
    return this.harvestService.create(parsed);
  }

  @Put(':id')
  @ApiBody({ schema: { $ref: '#/components/schemas/HarvestUpdate' } })
  update(
    @Param('id') id: string,
    @Body() data: Partial<{ name: string; propertyId: string }>,
  ) {
    const parsed = parseOrThrow(HarvestUpdateSchema, data);
    return this.harvestService.update(id, parsed);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.harvestService.remove(id);
  }
}
