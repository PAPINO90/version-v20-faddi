import { Controller, Post, Body, Get, Patch, Param, Delete } from '@nestjs/common';
import { AnnoncesService } from './annonces.service';
import { CreateAnnonceDto } from './dto/create-annonce.dto';

@Controller('annonces')
export class AnnoncesController {
  // Incrémenter le compteur de vues sur index
  @Patch(':id/increment-vues-index')
  async incrementVuesIndex(@Param('id') id: string) {
    return this.annoncesService.incrementVuesIndex(Number(id));
  }

  // Incrémenter le compteur de clics sur index
  @Patch(':id/increment-clics-index')
  async incrementClicsIndex(@Param('id') id: string) {
    return this.annoncesService.incrementClicsIndex(Number(id));
  }
  // Incrémenter le compteur de vues
  @Patch(':id/increment-vues')
  async incrementVues(@Param('id') id: string) {
    return this.annoncesService.incrementVues(Number(id));
  }

  // Incrémenter le compteur de clics
  @Patch(':id/increment-clics')
  async incrementClics(@Param('id') id: string) {
    return this.annoncesService.incrementClics(Number(id));
  }
  constructor(private readonly annoncesService: AnnoncesService) {}

  @Post()
  async create(@Body() dto: CreateAnnonceDto) {
    console.log('Reçu dans /api/annonces:', JSON.stringify(dto, null, 2));
    return this.annoncesService.create(dto);
  }

  @Get()
  async findAll() {
    return this.annoncesService.findAll();
  }
  
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: any) {
    return this.annoncesService.update(Number(id), dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.annoncesService.remove(Number(id));
  }
}
