import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Annonce } from './annonce.entity';
import { AnnonceImage } from './annonce-image.entity';
import { CreateAnnonceDto } from './dto/create-annonce.dto';

@Injectable()
export class AnnoncesService {
  // Incrémenter le compteur de vues sur index
  async incrementVuesIndex(id: number) {
    const annonce = await this.annonceRepo.findOne({ where: { id } });
    if (!annonce) throw new Error('Annonce non trouvée');
    annonce.vuesIndex = (annonce.vuesIndex || 0) + 1;
    return this.annonceRepo.save(annonce);
  }

  // Incrémenter le compteur de clics sur index
  async incrementClicsIndex(id: number) {
    const annonce = await this.annonceRepo.findOne({ where: { id } });
    if (!annonce) throw new Error('Annonce non trouvée');
    annonce.clicsIndex = (annonce.clicsIndex || 0) + 1;
    return this.annonceRepo.save(annonce);
  }
  // Incrémenter le compteur de vues
  async incrementVues(id: number) {
    const annonce = await this.annonceRepo.findOne({ where: { id } });
    if (!annonce) throw new Error('Annonce non trouvée');
    annonce.vues = (annonce.vues || 0) + 1;
    return this.annonceRepo.save(annonce);
  }

  // Incrémenter le compteur de clics
  async incrementClics(id: number) {
    const annonce = await this.annonceRepo.findOne({ where: { id } });
    if (!annonce) throw new Error('Annonce non trouvée');
    annonce.clics = (annonce.clics || 0) + 1;
    return this.annonceRepo.save(annonce);
  }
  constructor(
    @InjectRepository(Annonce)
    private readonly annonceRepo: Repository<Annonce>,
    @InjectRepository(AnnonceImage)
    private readonly imageRepo: Repository<AnnonceImage>,
  ) {}

  async create(dto: CreateAnnonceDto) {
    const annonce = this.annonceRepo.create({
      type: dto.type,
      titre: dto.titre,
      description: dto.description,
      pageCible: dto.pageCible,
      redirectionUrl: dto.redirectionUrl,
      animation: dto.animation,
      images: dto.images.map(img => this.imageRepo.create(img)),
    });
    return this.annonceRepo.save(annonce);
  }

  async findAll() {
    return this.annonceRepo.find({ relations: ['images'] });
  }

  async update(id: number, dto: any) {
    const annonce = await this.annonceRepo.findOne({ where: { id }, relations: ['images'] });
    if (!annonce) throw new Error('Annonce non trouvée');
    // Mettre à jour les champs principaux
    annonce.type = dto.type ?? annonce.type;
    annonce.titre = dto.titre ?? annonce.titre;
    annonce.description = dto.description ?? annonce.description;
    annonce.pageCible = dto.pageCible ?? annonce.pageCible;
    annonce.redirectionUrl = dto.redirectionUrl ?? annonce.redirectionUrl;
    annonce.animation = dto.animation ?? annonce.animation;
    if (typeof dto.active === 'boolean') {
      annonce.active = dto.active;
    }
    // Optionnel: gestion des images (remplacement complet si fourni)
    if (dto.images && Array.isArray(dto.images)) {
      annonce.images = dto.images.map(img => this.imageRepo.create(img));
    }
    return this.annonceRepo.save(annonce);
  }

  async remove(id: number) {
    const annonce = await this.annonceRepo.findOne({ where: { id }, relations: ['images'] });
    if (!annonce) throw new Error('Annonce non trouvée');
    // Supprimer les images associées
    if (annonce.images && annonce.images.length) {
      for (const img of annonce.images) {
        await this.imageRepo.delete(img.id);
      }
    }
    await this.annonceRepo.delete(id);
    return { deleted: true };
  }
}
