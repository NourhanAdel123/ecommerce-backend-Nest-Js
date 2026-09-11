import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class updateProductDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  price?: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  image?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string;
}
