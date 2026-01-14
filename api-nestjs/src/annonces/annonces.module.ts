import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Annonce } from './annonce.entity';
import { AnnonceImage } from './annonce-image.entity';
import { AnnoncesService } from './annonces.service';
import { AnnoncesController } from './annonces.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Annonce, AnnonceImage])],
  providers: [AnnoncesService],
  controllers: [AnnoncesController],
})
export class AnnoncesModule {}
