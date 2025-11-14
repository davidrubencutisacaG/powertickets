import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateOrganizerRequestDto {
  @IsNotEmpty()
  @IsString()
  organizationName!: string;

  @IsOptional()
  @IsString()
  ruc?: string;

  @IsOptional()
  @IsString()
  document?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

