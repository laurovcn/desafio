import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FarmerService } from '../farmer/farmer.service';
import { Role } from './roles.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly farmerService: FarmerService,
  ) {}

  async validateUser(id: string) {
    try {
      const farmer = await this.farmerService.findOne(id);
      // utiliza role definido no banco
      return { id: farmer.id, name: farmer.name, role: Role.FARMER };
    } catch {
      throw new UnauthorizedException();
    }
  }

  async login(user: any) {
    const payload = { sub: user.id, name: user.name, role: user.role };
    return { access_token: this.jwtService.sign(payload) };
  }
}
