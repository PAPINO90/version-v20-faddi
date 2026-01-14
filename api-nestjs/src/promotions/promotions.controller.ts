import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SubscribersService } from '../subscribers/subscribers.service';

@Controller('promotions')
export class PromotionsController {
  constructor(
    private readonly promotionsService: PromotionsService,
    private readonly subscribersService: SubscribersService, // Inject SubscribersService
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createPromotionDto: CreatePromotionDto) {
    const promo = await this.promotionsService.create(createPromotionDto);
    // Notifier les abonnés
    await this.subscribersService.notifyAllSubscribers(
      'Nouvelle promotion sur FADIDI',
      `Une nouvelle promotion a été ajoutée : ${promo.title}`,
    );
    return promo;
  }

  @Get()
  findAll(@Query('status') status?: string) {
    if (status === 'active') {
      return this.promotionsService.findActive();
    }
    if (status === 'featured') {
      return this.promotionsService.findFeatured();
    }
    return this.promotionsService.findAll();
  }

  @Get('category/:categoryId')
  findByCategory(@Param('categoryId') categoryId: string) {
    return this.promotionsService.findByCategory(categoryId);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  getStats() {
    return this.promotionsService.getPromotionStats();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.promotionsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updatePromotionDto: UpdatePromotionDto) {
    return this.promotionsService.update(id, updatePromotionDto);
  }

  @Patch(':id/sold')
  incrementSold(@Param('id') id: string, @Body('quantity') quantity?: number) {
    return this.promotionsService.incrementSoldQuantity(id, quantity);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.promotionsService.remove(id);
  }

  @Post('update-expired')
  @UseGuards(JwtAuthGuard)
  updateExpired() {
    return this.promotionsService.updateExpiredPromotions();
  }
}