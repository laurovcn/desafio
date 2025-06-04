import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';

function validateCpfCnpj(cpfCnpj: string): boolean {
  // Simples validação de formato (pode ser aprimorada com algoritmos reais)
  return /^\d{11}$/.test(cpfCnpj) || /^\d{14}$/.test(cpfCnpj);
}

@Controller('crops')
export class CropController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async findAll() {
    return this.prisma.crop.findMany({ include: { harvest: true } });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const crop = await this.prisma.crop.findUnique({
      where: { id },
      include: { harvest: true },
    });
    if (!crop) throw new NotFoundException('Crop not found');
    return crop;
  }

  @Post()
  async create(@Body() data: { name: string; harvestId: string }) {
    if (!data.name || !data.harvestId) {
      throw new BadRequestException('Name and harvestId are required');
    }
    return this.prisma.crop.create({ data });
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<{ name: string; harvestId: string }>,
  ) {
    return this.prisma.crop.update({ where: { id }, data });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.prisma.crop.delete({ where: { id } });
    return { deleted: true };
  }
}
