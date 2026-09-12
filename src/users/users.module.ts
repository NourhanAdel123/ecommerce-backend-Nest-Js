import { Module } from '@nestjs/common';
import { UsersController } from './users.controller.js';
import { UsersService } from './usres.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity.js';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [TypeOrmModule.forFeature([User])],
})
export class UserModule {}
