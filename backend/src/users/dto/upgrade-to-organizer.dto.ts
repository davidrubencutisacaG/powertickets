import { IsOptional, IsString } from 'class-validator';

export class UpgradeToOrganizerDto {
  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  dni?: string;

  @IsOptional()
  @IsString()
  selfieUrl?: string;
}

