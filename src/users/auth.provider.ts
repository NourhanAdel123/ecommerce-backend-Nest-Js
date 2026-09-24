import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity.js';
import { Repository } from 'typeorm';
import { RegisterDto } from './dtos/register.dto.js';
import bcrypt from 'bcryptjs';
import { LoginDto } from './dtos/login.dto.js';
import { accessTokenType, JWTPayloadType } from '../utils/types.js';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service.js';
import { randomBytes } from 'crypto';
import { ResetPasswordDto } from './dtos/reset-password.dto.js';

@Injectable()
export class AuthProvider {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  public async register(registerDto: RegisterDto): Promise<accessTokenType> {
    const { username, email, password } = registerDto;

    const userFound = await this.userRepository.findOne({ where: { email } });
    if (userFound) throw new BadRequestException('user already exist');

    const hashedPassword = await this.hashPassword(password);

    const verificationToken = randomBytes(32).toString('hex');
    let newUser = this.userRepository.create({
      email,
      username,
      password: hashedPassword,
      verificationToken,
    });

    newUser = await this.userRepository.save(newUser);

    this.mailService.sendVerificationEmail(newUser, verificationToken);
    const accessToken = await this.generateJwtToken({
      id: newUser.id,
      userType: newUser.userType,
    });
    return { accessToken };
  }

  public async login(
    loginDto: LoginDto,
  ): Promise<accessTokenType | { message: string }> {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new BadRequestException('user not found');
    if (!user.isVerfied) {
      let verificationToken = user.verificationToken;
      if (!verificationToken) {
        verificationToken = randomBytes(32).toString('hex');
        user.verificationToken = verificationToken;
        await this.userRepository.save(user);
      }
      this.mailService.sendVerificationEmail(user, verificationToken);

      return { message: 'Please verify your email before logging in.' };
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
      throw new BadRequestException('password in not correct');

    const accessToken = await this.generateJwtToken({
      id: user.id,
      userType: user.userType,
    });
    this.mailService.sendLoginEmail(user);
    return { accessToken };
  }
  private generateJwtToken(payload: JWTPayloadType): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  public async sendResetPasswordLink(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new BadRequestException('user not found');
    const resetPasswordToken = randomBytes(32).toString('hex');
    user.resetPasswordToken = resetPasswordToken;
    await this.userRepository.save(user);
    this.mailService.sendResetPasswordEmail(user, resetPasswordToken);
    return { message: 'reset password link has been sent to your email' };
  }

  public async getResetPasswordLink(
    userId: string,
    resetPasswordToken: string,
  ) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('user not found');
    if (user.resetPasswordToken !== resetPasswordToken)
      throw new BadRequestException('invalid reset password token');
    return { message: 'reset password link is valid' };
  }

  public async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { userId, resetPasswordToken, newPassword } = resetPasswordDto;
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('user not found');

    if (user.resetPasswordToken !== resetPasswordToken)
      throw new BadRequestException('invalid reset password token');

    const hashedPassword = await this.hashPassword(newPassword);
    user.password = hashedPassword;
    user.resetPasswordToken = null;

    await this.userRepository.save(user);
    return { message: 'password reset successfully' };
  }

  public async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }
}
