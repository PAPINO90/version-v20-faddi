import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HeaderBanner } from './entities/header-banner.entity';
import { CreateHeaderBannerDto } from './dto/create-header-banner.dto';
import { UpdateHeaderBannerDto } from './dto/update-header-banner.dto';

@Injectable()
export class HeaderBannersService {
  constructor(
    @InjectRepository(HeaderBanner)
    private headerBannersRepository: Repository<HeaderBanner>,
  ) {}

  async create(createHeaderBannerDto: CreateHeaderBannerDto): Promise<HeaderBanner> {
    const headerBanner = this.headerBannersRepository.create(createHeaderBannerDto);
    return await this.headerBannersRepository.save(headerBanner);
  }

  async findAll(): Promise<HeaderBanner[]> {
    return await this.headerBannersRepository.find({
      order: { displayOrder: 'ASC', createdAt: 'DESC' }
    });
  }

  async findActive(): Promise<HeaderBanner[]> {
    return await this.headerBannersRepository.find({
      where: { isActive: true },
      order: { displayOrder: 'ASC', createdAt: 'DESC' }
    });
  }

  async findOne(id: number): Promise<HeaderBanner> {
    const headerBanner = await this.headerBannersRepository.findOne({
      where: { id }
    });
    
    if (!headerBanner) {
      throw new NotFoundException(`Bannière header avec ID ${id} non trouvée`);
    }
    
    return headerBanner;
  }

  async update(id: number, updateHeaderBannerDto: UpdateHeaderBannerDto): Promise<HeaderBanner> {
    const headerBanner = await this.findOne(id);
    
    Object.assign(headerBanner, updateHeaderBannerDto);
    
    return await this.headerBannersRepository.save(headerBanner);
  }

  async remove(id: number): Promise<void> {
    const headerBanner = await this.findOne(id);
    await this.headerBannersRepository.remove(headerBanner);
  }

  async toggleActive(id: number): Promise<HeaderBanner> {
    const headerBanner = await this.findOne(id);
    headerBanner.isActive = !headerBanner.isActive;
    return await this.headerBannersRepository.save(headerBanner);
  }

  async hasActiveBanners(): Promise<boolean> {
    const count = await this.headerBannersRepository.count({
      where: { isActive: true }
    });
    return count > 0;
  }

  async incrementView(id: number): Promise<void> {
    await this.headerBannersRepository.increment({ id }, 'viewCount', 1);
  }

  async incrementClick(id: number): Promise<void> {
    await this.headerBannersRepository.increment({ id }, 'clickCount', 1);
  }

  async getStatistics(): Promise<any> {
    const total = await this.headerBannersRepository.count();
    const active = await this.headerBannersRepository.count({ where: { isActive: true } });
    
    const stats = await this.headerBannersRepository
      .createQueryBuilder('banner')
      .select('SUM(banner.viewCount)', 'totalViews')
      .addSelect('SUM(banner.clickCount)', 'totalClicks')
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