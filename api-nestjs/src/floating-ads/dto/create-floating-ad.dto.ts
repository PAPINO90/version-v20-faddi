import { IsString, IsOptional, IsEnum, IsBoolean, IsInt, IsDateString, IsUrl, Matches, Min, Max } from 'class-validator';
import { DisplayMode, Position } from '../entities/floating-ad.entity';

export class CreateFloatingAdDto {
  @IsInt()
  @IsOptional()
  redisplayDelay?: number;
  @IsInt()
  @IsOptional()
  // Durée d'affichage en millisecondes
  displayDuration?: number;
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsEnum(DisplayMode)
  displayMode: DisplayMode;

  @IsEnum(Position)
  position: Position;


  @IsString()
  @IsOptional()
  width?: string;

  @IsString()
  @IsOptional()
  height?: string;

  @IsString()
  @Matches(/^(transparent|#[0-9A-F]{6})$/i)
  backgroundColor: string;

  @IsString()
  @Matches(/^(transparent|#[0-9A-F]{6})$/i)
  textColor: string;

  @IsString()
  @IsOptional()
  targetPages?: string;

  @IsUrl()
  @IsOptional()
  redirectUrl?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;
}