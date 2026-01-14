import { IsString, IsEnum, IsDateString, IsOptional } from 'class-validator';

export enum FeedbackType {
  CONFIRMATION = 'confirmation',
  PROBLEM = 'problem',
  REVIEW = 'review'
}

export enum FeedbackStatus {
  DELIVERED = 'delivered',
  DISPUTE = 'dispute',
  RESOLVED = 'resolved'
}

export class CreateFeedbackDto {
  @IsString()
  orderId: string;

  @IsEnum(FeedbackType)
  type: FeedbackType;

  @IsString()
  message: string;

  @IsString()
  customerFeedback: string;

  @IsEnum(FeedbackStatus)
  status: FeedbackStatus;

  @IsDateString()
  timestamp: string;

  @IsOptional()
  @IsString()
  adminResponse?: string;

  @IsOptional()
  @IsDateString()
  adminResponseDate?: string;
}