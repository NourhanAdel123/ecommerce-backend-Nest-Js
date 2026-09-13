import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './usres.service.js';
import { RegisterDto } from './dtos/register.dto.js';
import { LoginDto } from './dtos/login.dto.js';
import { AuthGuard } from './guards/auth.guard.js';
import { CurrentUser } from './decorators/current-user.decorator.js';
import * as types from '../utils/types.js';

@Controller('/api/users')
export class UsersController {
  constructor(private readonly UsersService: UsersService) {}
  @Post('/auth/register')
  public register(@Body() body: RegisterDto) {
    return this.UsersService.register(body);
  }

  @Post('/auth/login')
  @HttpCode(HttpStatus.OK)
  login(@Body() body: LoginDto) {
    return this.UsersService.login(body);
  }

  @Get('current-user')
  @UseGuards(AuthGuard)
  public getCurrentUser(@CurrentUser() payload: types.JWTPayloadType) {
    return this.UsersService.getCurrentUser(payload.id);
  }
}
