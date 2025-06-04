import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class HarvestService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.harvest.findMany({
      include: { property: true, crops: true },
    });
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
    if (!data.name || !data.propertyId) {
      throw new BadRequestException('Name and propertyId are required');
    }
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
