import { IsString, IsEmail, IsOptional, IsArray, IsNumber, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsNumber()
  quantity: number;

  @IsNumber()
  total: number;
}

export class CreateOrderDto {
  @IsString()
  customerName: string;

  @IsString()
  customerPhone: string;

  @IsEmail()
  @IsOptional()
  customerEmail?: string;

  @IsString()
  deliveryAddress: string;

  @IsString()
  deliveryCity: string;

  @IsString()
  @IsOptional()
  deliveryTime?: string;

  @IsString()
  @IsOptional()
  deliveryNotes?: string;

  // Ajout : source de la commande (ex: 'haut-game')
  @IsString()
  @IsOptional()
  source?: string;

  @IsArray()
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsNumber()
  subtotal: number;

  @IsNumber()
  deliveryFee: number;

  @IsNumber()
  total: number;

  @IsEnum(['wave', 'orange', 'card', 'promotion'])
  paymentMethod: string;

  @IsEnum(['pending', 'confirmed', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'])
  @IsOptional()
  status?: string;
}