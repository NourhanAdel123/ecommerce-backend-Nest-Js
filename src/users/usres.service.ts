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
import { join } from 'path';
import { unlinkSync, existsSync } from 'fs';
import { ResetPasswordDto } from './dtos/reset-password.dto.js';
import { forgotPasswordDto } from './dtos/forgot-password.dto.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly authProvider: AuthProvider,
  ) {}

  public async register(registerDto: RegisterDto): Promise<accessTokenType> {
    return this.authProvider.register(registerDto);
  }

  public async login(
    loginDto: LoginDto,
  ): Promise<accessTokenType | { message: string }> {
    return this.authProvider.login(loginDto);
  }

  public sendResetPasswordLink(forgotPasswordDto: forgotPasswordDto) {
    return this.authProvider.sendResetPasswordLink(forgotPasswordDto.email);
  }

  public getResetPasswordLink(userId: string, resetPasswordToken: string) {
    return this.authProvider.getResetPasswordLink(userId, resetPasswordToken);
  }

  public resetPassword(resetPasswordDto: ResetPasswordDto) {
    return this.authProvider.resetPassword(resetPasswordDto);
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

  public async uploadProfileImage(userid: string, imgeName: string) {
    const user = await this.getCurrentUser(userid);
    if (user.profileImage) {
      await this.removeProfileImage(userid);
      user.profileImage = imgeName;
    } else {
      user.profileImage = imgeName;
    }
    return this.userRepository.save(user);
  }

  public async removeProfileImage(userId: string) {
    const user = await this.getCurrentUser(userId);
    if (!user.profileImage)
      throw new BadRequestException('there is no image to remove');
    const imagePath = join(
      process.cwd(),
      `./images/users/${user.profileImage}`,
    );
    if (existsSync(imagePath)) {
      unlinkSync(imagePath);
    }

    user.profileImage = null;

    return this.userRepository.save(user);
  }

  public async verifyEmail(userId: string, token: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('user not found');
    if (user.verificationToken !== token)
      throw new BadRequestException('invalid verification token');
    if (user.isVerfied)
      throw new BadRequestException('your email has been verified already');
    user.isVerfied = true;
    user.verificationToken = null;
    await this.userRepository.save(user);
    return { message: 'your email has been verified successfully' };
  }

  public async getAll(): Promise<User[]> {
    return this.userRepository.find();
  }
}
