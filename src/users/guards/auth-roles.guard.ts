import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../usres.service.js';
import { UserType } from '../../utils/enums.js';

@Injectable()
export class AuthRolesGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const roles: UserType[] = this.reflector.getAllAndOverride('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles || roles.length === 0) return false;

    const request = context.switchToHttp().getRequest();
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (token && type === 'Bearer') {
      try {
        const payload = await this.jwtService.verifyAsync(token, {
          secret: this.configService.get<string>('JWT_SECRET'),
        });

        const user = await this.userService.getCurrentUser(payload.id);
        if (!user) return false;

        if (roles.includes(user.userType)) {
          request['user'] = payload;
          return true;
        }
      } catch (error) {
        throw new UnauthorizedException('access denied, invalid token');
      }
    } else {
      throw new UnauthorizedException('access denied, invalid token');
    }
    return false;
  }
}
