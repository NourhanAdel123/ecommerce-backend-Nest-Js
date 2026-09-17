import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity.js';
import { Repository } from 'typeorm';
import { RegisterDto } from './dtos/register.dto.js';
import bcrypt from 'bcryptjs';
import { LoginDto } from './dtos/login.dto.js';
import { accessTokenType, JWTPayloadType } from '../utils/types.js';
import { JwtService } from '@nestjs/jwt';
import { promises } from 'dns';
import { UpdateUserDto } from './dtos/update-user.dto.js';
import { ExceptionHandler } from '@nestjs/core/errors/exception-handler.js';
import { AuthProvider } from './auth.provider.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly authProvider: AuthProvider,
  ) {}

  public async register(registerDto: RegisterDto): Promise<accessTokenType> {
    return this.authProvider.register(registerDto);
  }

  public async login(loginDto: LoginDto): Promise<accessTokenType> {
    return this.authProvider.login(loginDto);
  }

  public async updatUser(id: string, updateUserDto: UpdateUserDto) {
    const { username, password } = updateUserDto;

    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new BadRequestException('user not found');

    user.username = username ?? user.username;

    if (password) {
      user.password = await this.authProvider.hashPassword(password);
    }

    return this.userRepository.save(user);
  }

  public async delteUser(id: string, payload: JWTPayloadType) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new BadRequestException('user not found');

    if (user.id === payload.id || payload.userType === 'admin') {
      await this.userRepository.remove(user);
      return { message: ' user has been deleted' };
    }
    throw new ForbiddenException('access denied , you are not allowed');
  }

  public async getCurrentUser(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new BadRequestException('user not found');
    return user;
  }

  public async getAll(): Promise<User[]> {
    return this.userRepository.find();
  }
}
