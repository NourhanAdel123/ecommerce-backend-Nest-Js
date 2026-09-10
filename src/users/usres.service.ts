import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  public getAll() {
    return [
      { id: 1, name: 'nourhan', age: '24' },
      { id: 2, name: 'ahmed', age: '26' },
      { id: 3, name: 'yousef', age: '24' },
    ];
  }
}
