import { Controller, Get } from '@nestjs/common';
import { UsersService } from './usres.service.js';

@Controller()
export class UsersController {
  constructor(private readonly UsersService: UsersService) {}
  @Get('/api/users')
  public getUsers() {
    return this.UsersService.getAll();
  }
}
