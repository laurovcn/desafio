import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PropertyService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.property.findMany({
      include: { farmer: true, harvests: true },
    });
  }

  async findOne(id: string) {
    const property = await this.prisma.property.findUnique({
      where: { id },
      include: { farmer: true, harvests: true },
    });
    if (!property) throw new NotFoundException('Property not found');
    return property;
  }

  async create(data: {
    name: string;
    city: string;
    state: string;
    totalArea: number;
    arableArea: number;
    vegetationArea: number;
    farmerId: string;
  }) {
    if (
      (data.arableArea ?? 0) + (data.vegetationArea ?? 0) >
      (data.totalArea ?? 0)
    ) {
      throw new BadRequestException(
        'The sum of arable and vegetation areas cannot exceed the total area',
      );
    }
    return this.prisma.property.create({ data });
  }

  async update(
    id: string,
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
    if (
      (data.arableArea ?? 0) + (data.vegetationArea ?? 0) >
      (data.totalArea ?? 0)
    ) {
      throw new BadRequestException(
        'The sum of arable and vegetation areas cannot exceed the total area',
      );
    }
    return this.prisma.property.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.prisma.property.delete({ where: { id } });
    return { deleted: true };
  }
}
