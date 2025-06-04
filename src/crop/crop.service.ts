import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CropService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.crop.findMany({
        skip,
        take: limit,
        include: { harvest: true },
      }),
      this.prisma.crop.count(),
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
    const crop = await this.prisma.crop.findUnique({
      where: { id },
      include: { harvest: true },
    });
    if (!crop) throw new NotFoundException('Crop not found');
    return crop;
  }

  async create(data: { name: string; harvestId: string }) {
    if (!data.name || !data.harvestId) {
      throw new BadRequestException('Name and harvestId are required');
    }
    return this.prisma.crop.create({ data });
  }

  async update(id: string, data: Partial<{ name: string; harvestId: string }>) {
    return this.prisma.crop.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.prisma.crop.delete({ where: { id } });
    return { deleted: true };
  }
}
