import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';

function validateHarvestData(data: { name?: string; propertyId?: string }) {
  if (!data.name || !data.propertyId) {
    throw new BadRequestException('Name and propertyId are required');
  }
}

@Injectable()
export class HarvestService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.harvest.findMany({
        skip,
        take: limit,
        include: { property: true, crops: true },
      }),
      this.prisma.harvest.count(),
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
    const harvest = await this.prisma.harvest.findUnique({
      where: { id },
      include: { property: true, crops: true },
    });
    if (!harvest) throw new NotFoundException('Harvest not found');
    return harvest;
  }

  async create(data: { name: string; propertyId: string }) {
    validateHarvestData(data);
    return this.prisma.harvest.create({ data });
  }

  async update(
    id: string,
    data: Partial<{ name: string; propertyId: string }>,
  ) {
    return this.prisma.harvest.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.prisma.harvest.delete({ where: { id } });
    return { deleted: true };
  }
}
