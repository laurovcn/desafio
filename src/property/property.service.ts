import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';

function validateAreas(data: {
  arableArea?: number;
  vegetationArea?: number;
  totalArea?: number;
}) {
  if (
    (data.arableArea ?? 0) + (data.vegetationArea ?? 0) >
    (data.totalArea ?? 0)
  ) {
    throw new BadRequestException(
      'The sum of arable and vegetation areas cannot exceed the total area',
    );
  }
}

@Injectable()
export class PropertyService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.property.findMany({
        skip,
        take: limit,
        include: { farmer: true, harvests: true },
      }),
      this.prisma.property.count(),
    ]);
    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
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
    validateAreas(data);
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
    validateAreas(data);
    return this.prisma.property.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.prisma.property.delete({ where: { id } });
    return { deleted: true };
  }
}
