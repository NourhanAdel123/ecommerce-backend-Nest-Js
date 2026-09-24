import { IsNotEmpty, IsString, Length, MaxLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @Length(6, 24)
  @MaxLength(24)
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
  @IsString()
  @IsNotEmpty()
  resetPasswordToken: string;
}
