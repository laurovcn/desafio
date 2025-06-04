import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboard() {
    const totalFarms = await this.prisma.property.count();
    const totalHectaresAgg = await this.prisma.property.aggregate({
      _sum: { totalArea: true },
    });
    const byState = await this.prisma.property.groupBy({
      by: ['state'],
      _count: { _all: true },
    });
    const byCrop = await this.prisma.crop.groupBy({
      by: ['name'],
      _count: { _all: true },
    });
    const landUseAgg = await this.prisma.property.aggregate({
      _sum: { arableArea: true, vegetationArea: true },
    });
    return {
      totalFarms,
      totalHectares: totalHectaresAgg._sum.totalArea || 0,
      byState: byState.map((s: any) => ({
        state: s.state,
        count: s._count._all,
      })),
      byCrop: byCrop.map((c: any) => ({ crop: c.name, count: c._count._all })),
      landUse: {
        arableArea: landUseAgg._sum.arableArea || 0,
        vegetationArea: landUseAgg._sum.vegetationArea || 0,
      },
    };
  }
}
