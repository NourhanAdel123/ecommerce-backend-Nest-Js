import { Controller, Get } from '@nestjs/common';

@Controller()
export class UsersController {
  @Get('/api/users')
  public getUsers() {
    return [
      { id: 1, name: 'nourhan', age: '24' },
      { id: 2, name: 'ahmed', age: '26' },
      { id: 3, name: 'yousef', age: '24' },
    ];
  }
}
