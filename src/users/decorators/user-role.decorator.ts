import { SetMetadata } from '@nestjs/common';
import { UserType } from '../../utils/enums.js';

export const Roles = (...roles: UserType[]) => {
  return SetMetadata('roles', roles);
};
