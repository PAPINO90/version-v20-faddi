import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FloatingAd } from './entities/floating-ad.entity';
import { CreateFloatingAdDto } from './dto/create-floating-ad.dto';
import { UpdateFloatingAdDto } from './dto/update-floating-ad.dto';

@Injectable()
export class FloatingAdsService {
  constructor(
    @InjectRepository(FloatingAd)
    private floatingAdsRepository: Repository<FloatingAd>,
  ) {}

  async create(createFloatingAdDto: CreateFloatingAdDto): Promise<FloatingAd> {
    const floatingAd = this.floatingAdsRepository.create(createFloatingAdDto);
    return await this.floatingAdsRepository.save(floatingAd);
  }

  async findAll(): Promise<FloatingAd[]> {
    return await this.floatingAdsRepository.find({
      order: { createdAt: 'DESC' }
    });
  }

  async findActive(page?: string): Promise<FloatingAd[]> {
    const now = new Date();
    const query = this.floatingAdsRepository.createQueryBuilder('ad')
      .where('ad.isActive = :isActive', { isActive: true })
      .andWhere('(ad.startDate IS NULL OR ad.startDate <= :now)', { now })
      .andWhere('(ad.endDate IS NULL OR ad.endDate >= :now)', { now });

    if (page) {
      query.andWhere('(ad.targetPages = :all OR ad.targetPages LIKE :page)', {
        all: '*',
        page: `%${page}%`
      });
    }

    return await query.orderBy('ad.createdAt', 'DESC').getMany();
  }

  async findOne(id: number): Promise<FloatingAd> {
    const floatingAd = await this.floatingAdsRepository.findOne({
      where: { id }
    });

    if (!floatingAd) {
      throw new NotFoundException(`Publicité flottante avec l'ID ${id} non trouvée`);
    }

    return floatingAd;
  }

  async update(id: number, updateFloatingAdDto: UpdateFloatingAdDto): Promise<FloatingAd> {
    const floatingAd = await this.findOne(id);
    
    Object.assign(floatingAd, updateFloatingAdDto);
    
    return await this.floatingAdsRepository.save(floatingAd);
  }

  async remove(id: number): Promise<void> {
    const floatingAd = await this.findOne(id);
    await this.floatingAdsRepository.remove(floatingAd);
  }

  async incrementView(id: number): Promise<void> {
    await this.floatingAdsRepository.increment({ id }, 'viewCount', 1);
  }

  async incrementClick(id: number): Promise<void> {
    await this.floatingAdsRepository.increment({ id }, 'clickCount', 1);
  }

  async getStatistics(): Promise<any> {
    const total = await this.floatingAdsRepository.count();
    const active = await this.floatingAdsRepository.count({ where: { isActive: true } });
    
    const stats = await this.floatingAdsRepository
      .createQueryBuilder('ad')
      .select('SUM(ad.viewCount)', 'totalViews')
      .addSelect('SUM(ad.clickCount)', 'totalClicks')
      .getRawOne();

    return {
      total,
      active,
      inactive: total - active,
      totalViews: parseInt(stats.totalViews) || 0,
      totalClicks: parseInt(stats.totalClicks) || 0,
      ctr: stats.totalViews > 0 ? ((stats.totalClicks / stats.totalViews) * 100).toFixed(2) : '0.00'
    };
  }
}