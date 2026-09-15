import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(2, 10)
  @IsOptional()
  username?: string;

  @IsNotEmpty()
  @MinLength(6)
  @IsString()
  @IsOptional()
  password?: string;
}
