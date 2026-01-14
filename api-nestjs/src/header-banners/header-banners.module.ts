import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HeaderBannersService } from './header-banners.service';
import { HeaderBannersController } from './header-banners.controller';
import { HeaderBanner } from './entities/header-banner.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HeaderBanner])],
  controllers: [HeaderBannersController],
  providers: [HeaderBannersService],
  exports: [HeaderBannersService],
})
export class HeaderBannersModule {}