import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity.js';
import { Repository } from 'typeorm';
import { RegisterDto } from './dtos/register.dto.js';
import bcrypt from 'bcryptjs';
import { LoginDto } from './dtos/login.dto.js';
import { accessTokenType, JWTPayloadType } from '../utils/types.js';
import { JwtService } from '@nestjs/jwt';

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

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

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

  private generateJwtToken(payload: JWTPayloadType): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  public async getCurrentUser(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new BadRequestException('user not found');
    return user;
  }
}
