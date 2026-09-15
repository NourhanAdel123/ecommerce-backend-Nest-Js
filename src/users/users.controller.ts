import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './usres.service.js';
import { RegisterDto } from './dtos/register.dto.js';
import { LoginDto } from './dtos/login.dto.js';
import { AuthGuard } from './guards/auth.guard.js';
import { CurrentUser } from './decorators/current-user.decorator.js';
import * as types from '../utils/types.js';
import { Roles } from './decorators/user-role.decorator.js';
import { UserType } from '../utils/enums.js';
import { AuthRolesGuard } from './guards/auth-roles.guard.js';
import { UpdateUserDto } from './dtos/update-user.dto.js';

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

  @Get()
  @Roles(UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  public getAllUsers() {
    return this.UsersService.getAll();
  }

  @Put()
  @Roles(UserType.ADMIN, UserType.NORMAL_USER)
  @UseGuards(AuthRolesGuard)
  public updateUser(
    @CurrentUser() payload: types.JWTPayloadType,
    @Body() body: UpdateUserDto,
  ) {
    return this.UsersService.updatUser(payload.id, body);
  }

  @Delete(':id')
  @Roles(UserType.ADMIN, UserType.NORMAL_USER)
  @UseGuards(AuthRolesGuard)
  public delete(
    @Param('id') id: string,
    @CurrentUser() payload: types.JWTPayloadType,
  ) {
    return this.UsersService.delteUser(id, payload);
  }
}
