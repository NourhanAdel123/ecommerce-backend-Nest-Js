import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class forgotPasswordDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
