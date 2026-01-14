import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { HeaderBannersService } from './header-banners.service';
import { CreateHeaderBannerDto } from './dto/create-header-banner.dto';
import { UpdateHeaderBannerDto } from './dto/update-header-banner.dto';

@Controller('header-banners')
export class HeaderBannersController {
  constructor(private readonly headerBannersService: HeaderBannersService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createHeaderBannerDto: CreateHeaderBannerDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    if (file) {
      createHeaderBannerDto.imageUrl = `/uploads/${file.filename}`;
    } else if (!createHeaderBannerDto.imageUrl) {
      throw new BadRequestException('Image requise');
    }
    
    return await this.headerBannersService.create(createHeaderBannerDto);
  }

  @Get()
  async findAll() {
    return await this.headerBannersService.findAll();
  }

  @Get('active')
  async findActive() {
    return await this.headerBannersService.findActive();
  }

  @Get('has-active')
  async hasActiveBanners() {
    const hasActive = await this.headerBannersService.hasActiveBanners();
    return { hasActiveBanners: hasActive };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.headerBannersService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string, 
    @Body() updateHeaderBannerDto: UpdateHeaderBannerDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    if (file) {
      updateHeaderBannerDto.imageUrl = `/uploads/${file.filename}`;
    }
    
    return await this.headerBannersService.update(+id, updateHeaderBannerDto);
  }

  @Patch(':id/toggle-active')
  async toggleActive(@Param('id') id: string) {
    return await this.headerBannersService.toggleActive(+id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.headerBannersService.remove(+id);
  }

  @Post(':id/view')
  async incrementView(@Param('id') id: string) {
    await this.headerBannersService.incrementView(+id);
    return { success: true };
  }

  @Post(':id/click')
  async incrementClick(@Param('id') id: string) {
    await this.headerBannersService.incrementClick(+id);
    return { success: true };
  }

  @Get('statistics/all')
  async getStatistics() {
    return await this.headerBannersService.getStatistics();
  }
}