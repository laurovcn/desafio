import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';

export function validateCpfCnpj(cpfCnpj: string): boolean {
  return /^\d{11}$/.test(cpfCnpj) || /^\d{14}$/.test(cpfCnpj);
}

@Injectable()
export class FarmerService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.farmer.findMany({
        skip,
        take: limit,
        include: { properties: true },
      }),
      this.prisma.farmer.count(),
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
    const farmer = await this.prisma.farmer.findUnique({
      where: { id },
      include: { properties: true },
    });
    if (!farmer) throw new NotFoundException('Farmer not found');
    return farmer;
  }

  async create(data: { cpfCnpj: string; name: string }) {
    if (!validateCpfCnpj(data.cpfCnpj)) {
      throw new BadRequestException('Invalid CPF or CNPJ');
    }
    const exists = await this.prisma.farmer.findUnique({
      where: { cpfCnpj: data.cpfCnpj },
    });
    if (exists) throw new BadRequestException('CPF/CNPJ already registered');
    return this.prisma.farmer.create({ data });
  }

  async update(id: string, data: Partial<{ cpfCnpj: string; name: string }>) {
    if (data.cpfCnpj && !validateCpfCnpj(data.cpfCnpj)) {
      throw new BadRequestException('Invalid CPF or CNPJ');
    }
    return this.prisma.farmer.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.prisma.farmer.delete({ where: { id } });
    return { deleted: true };
  }
}
