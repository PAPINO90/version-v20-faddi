import { Controller, Get, Post, Body, Patch, Put, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { FloatingAdsService } from './floating-ads.service';
import { CreateFloatingAdDto } from './dto/create-floating-ad.dto';
import { UpdateFloatingAdDto } from './dto/update-floating-ad.dto';

@Controller('floating-ads')
export class FloatingAdsController {
  constructor(private readonly floatingAdsService: FloatingAdsService) {}

  @Post()
  create(@Body() createFloatingAdDto: CreateFloatingAdDto) {
    return this.floatingAdsService.create(createFloatingAdDto);
  }

  @Get()
  findAll() {
    return this.floatingAdsService.findAll();
  }

  @Get('active')
  findActive(@Query('page') page?: string) {
    return this.floatingAdsService.findActive(page);
  }

  @Get('statistics')
  getStatistics() {
    return this.floatingAdsService.getStatistics();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.floatingAdsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFloatingAdDto: UpdateFloatingAdDto) {
    return this.floatingAdsService.update(+id, updateFloatingAdDto);
  }

  @Put(':id')
  updatePut(@Param('id') id: string, @Body() updateFloatingAdDto: UpdateFloatingAdDto) {
    return this.floatingAdsService.update(+id, updateFloatingAdDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.floatingAdsService.remove(+id);
  }

  @Post(':id/view')
  incrementView(@Param('id') id: string) {
    return this.floatingAdsService.incrementView(+id);
  }

  @Post(':id/click')
  incrementClick(@Param('id') id: string) {
    return this.floatingAdsService.incrementClick(+id);
  }
}