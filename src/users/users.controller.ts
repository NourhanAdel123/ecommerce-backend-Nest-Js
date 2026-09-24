import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
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
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { forgotPasswordDto } from './dtos/forgot-password.dto.js';
import { ResetPasswordDto } from './dtos/reset-password.dto.js';

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

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  public forgotPassword(@Body() body: forgotPasswordDto) {
    return this.UsersService.sendResetPasswordLink(body);
  }

  @Get('reset-password/:userId/:token')
  @HttpCode(HttpStatus.OK)
  public getResetPasswordLink(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('token') token: string,
  ) {
    return this.UsersService.getResetPasswordLink(userId, token);
  }

  @Post('reset-password')
  public resetPassword(@Body() body: ResetPasswordDto) {
    return this.UsersService.resetPassword(body);
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

  @Delete(['remove-profile-image', 'profile-image'])
  @Roles(UserType.ADMIN, UserType.NORMAL_USER)
  @UseGuards(AuthRolesGuard)
  public deleteProfileImage(@CurrentUser() payload: types.JWTPayloadType) {
    return this.UsersService.removeProfileImage(payload.id);
  }

  @Delete(':id')
  @Roles(UserType.ADMIN, UserType.NORMAL_USER)
  @UseGuards(AuthRolesGuard)
  public delete(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() payload: types.JWTPayloadType,
  ) {
    return this.UsersService.delteUser(id, payload);
  }

  @Post('profile-image')
  @Roles(UserType.ADMIN, UserType.NORMAL_USER)
  @UseGuards(AuthRolesGuard)
  @UseInterceptors(
    FileInterceptor('profile-image', {
      storage: diskStorage({
        destination: './images/users',
        filename: (req, file, cb) => {
          const prefix = `${Date.now()}-${Math.round(Math.random() * 1000000)}`;

          const filename = `${prefix}-${file.originalname}`;

          cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image')) {
          cb(null, true);
        } else {
          cb(new BadRequestException('unsupported file foramat'), false);
        }
      },
      limits: { fileSize: 1024 * 1024 * 2 },
    }),
  )
  public uploadUserProfile(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() payload: types.JWTPayloadType,
  ) {
    if (!file) throw new BadRequestException('image is required');
    return this.UsersService.uploadProfileImage(payload.id, file.filename);
  }
  @Get('verify-email/:id/:token')
  public verifyEmail(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('token') token: string,
  ) {
    return this.UsersService.verifyEmail(id, token);
  }
}
