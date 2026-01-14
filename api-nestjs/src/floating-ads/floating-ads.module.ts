import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FloatingAdsService } from './floating-ads.service';
import { FloatingAdsController } from './floating-ads.controller';
import { FloatingAd } from './entities/floating-ad.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FloatingAd])],
  controllers: [FloatingAdsController],
  providers: [FloatingAdsService],
  exports: [FloatingAdsService]
})
export class FloatingAdsModule {}