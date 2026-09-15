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

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  public async register(registerDto: RegisterDto): Promise<accessTokenType> {
    const { username, email, password } = registerDto;

    const userFound = await this.userRepository.findOne({ where: { email } });
    if (userFound) throw new BadRequestException('user already exist');

    const hashedPassword = await this.hashPassword(password);

    let newUser = this.userRepository.create({
      email,
      username,
      password: hashedPassword,
    });

    newUser = await this.userRepository.save(newUser);

    const accessToken = await this.generateJwtToken({
      id: newUser.id,
      userType: newUser.userType,
    });
    return { accessToken };
  }

  public async login(loginDto: LoginDto): Promise<accessTokenType> {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new BadRequestException('user not found');

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
      throw new BadRequestException('password in not correct');

    const accessToken = await this.generateJwtToken({
      id: user.id,
      userType: user.userType,
    });
    return { accessToken };
  }

  public async updatUser(id: string, updateUserDto: UpdateUserDto) {
    const { username, password } = updateUserDto;

    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new BadRequestException('user not found');

    user.username = username ?? user.username;

    if (password) {
      user.password = await this.hashPassword(password);
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

  private generateJwtToken(payload: JWTPayloadType): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  public async getCurrentUser(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new BadRequestException('user not found');
    return user;
  }

  public async getAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  public async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }
}
