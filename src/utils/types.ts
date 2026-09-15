import { UserType } from './enums.js';

export type JWTPayloadType = {
  id: string;
  userType: UserType;
};

export type accessTokenType = {
  accessToken: string;
};
