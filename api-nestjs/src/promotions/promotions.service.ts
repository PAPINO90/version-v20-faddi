import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Promotion, PromotionStatus } from './entities/promotion.entity';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';

@Injectable()
export class PromotionsService {
  constructor(
    @InjectRepository(Promotion)
    private promotionsRepository: Repository<Promotion>,
  ) {}

  async create(createPromotionDto: CreatePromotionDto): Promise<Promotion> {
    // Calculer le pourcentage de réduction automatiquement
    const discountPercentage = Math.round(
      ((createPromotionDto.originalPrice - createPromotionDto.promotionPrice) / 
       createPromotionDto.originalPrice) * 100
    );

    const promotion = this.promotionsRepository.create({
      ...createPromotionDto,
      discountPercentage,
      startDate: new Date(createPromotionDto.startDate),
      endDate: new Date(createPromotionDto.endDate),
    });

    return this.promotionsRepository.save(promotion);
  }

  async findAll(): Promise<Promotion[]> {
    return this.promotionsRepository.find({
      relations: ['product', 'category'],
      order: { createdAt: 'DESC' },
    });
  }

  async findActive(): Promise<Promotion[]> {
    const now = new Date();
    return this.promotionsRepository.find({
      where: {
        status: PromotionStatus.ACTIVE,
        startDate: LessThanOrEqual(now),
        endDate: MoreThanOrEqual(now),
      },
      relations: ['product', 'category'],
      order: { isFeatured: 'DESC', createdAt: 'DESC' },
    });
  }

  async findByCategory(categoryId: string): Promise<Promotion[]> {
    const now = new Date();
    return this.promotionsRepository.find({
      where: {
        categoryId,
        status: PromotionStatus.ACTIVE,
        startDate: LessThanOrEqual(now),
        endDate: MoreThanOrEqual(now),
      },
      relations: ['product', 'category'],
      order: { isFeatured: 'DESC', createdAt: 'DESC' },
    });
  }

  async findFeatured(): Promise<Promotion[]> {
    const now = new Date();
    return this.promotionsRepository.find({
      where: {
        isFeatured: true,
        status: PromotionStatus.ACTIVE,
        startDate: LessThanOrEqual(now),
        endDate: MoreThanOrEqual(now),
      },
      relations: ['product', 'category'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Promotion> {
    const promotion = await this.promotionsRepository.findOne({
      where: { id },
      relations: ['product', 'category'],
    });

    if (!promotion) {
      throw new NotFoundException(`Promotion with ID ${id} not found`);
    }

    return promotion;
  }

  async update(id: string, updatePromotionDto: UpdatePromotionDto): Promise<Promotion> {
    const promotion = await this.findOne(id);

    // Recalculer le pourcentage si les prix ont changé
    if (updatePromotionDto.originalPrice || updatePromotionDto.promotionPrice) {
      const originalPrice = updatePromotionDto.originalPrice ?? promotion.originalPrice;
      const promotionPrice = updatePromotionDto.promotionPrice ?? promotion.promotionPrice;
      
      updatePromotionDto.discountPercentage = Math.round(
        ((originalPrice - promotionPrice) / originalPrice) * 100
      );
    }

    // Convertir les dates si nécessaire
    if (updatePromotionDto.startDate) {
      updatePromotionDto.startDate = new Date(updatePromotionDto.startDate) as any;
    }
    if (updatePromotionDto.endDate) {
      updatePromotionDto.endDate = new Date(updatePromotionDto.endDate) as any;
    }

    Object.assign(promotion, updatePromotionDto);
    return this.promotionsRepository.save(promotion);
  }

  async remove(id: string): Promise<void> {
    const promotion = await this.findOne(id);
    await this.promotionsRepository.remove(promotion);
  }

  async incrementSoldQuantity(id: string, quantity: number = 1): Promise<Promotion> {
    const promotion = await this.findOne(id);
    promotion.soldQuantity += quantity;
    return this.promotionsRepository.save(promotion);
  }

  async updateExpiredPromotions(): Promise<void> {
    const now = new Date();
    await this.promotionsRepository.update(
      {
        status: PromotionStatus.ACTIVE,
        endDate: LessThanOrEqual(now),
      },
      {
        status: PromotionStatus.EXPIRED,
      }
    );
  }

  async getPromotionStats(): Promise<any> {
    const totalPromotions = await this.promotionsRepository.count();
    const activePromotions = await this.promotionsRepository.count({
      where: { status: PromotionStatus.ACTIVE }
    });
    const expiredPromotions = await this.promotionsRepository.count({
      where: { status: PromotionStatus.EXPIRED }
    });

    return {
      total: totalPromotions,
      active: activePromotions,
      expired: expiredPromotions,
    };
  }
}