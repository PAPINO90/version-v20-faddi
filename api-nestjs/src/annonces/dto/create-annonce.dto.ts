import { IsString, IsOptional, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';


// Removed duplicate declaration of CreateAnnonceDto
// ...existing code...

export class AnnonceImageDto {
  @IsString()
  titre: string;

  @IsString()
  description: string;

  @IsString()
  type: string;

  @IsString()
  imageBase64: string;
}

export class CreateAnnonceDto {
  @IsString()
  type: string;

  @IsString()
  titre: string;

  @IsString()
  description: string;

  @IsString()
  pageCible: string;

  @IsOptional()
  @IsString()
  redirectionUrl?: string;

  @IsOptional()
  @IsString()
  animation?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnnonceImageDto)
  images: AnnonceImageDto[];
}
