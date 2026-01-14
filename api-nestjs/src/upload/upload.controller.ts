
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  BadRequestException,
  Query,
  Param,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProductsService } from '../products/products.service';
import { FloatingAdsService } from '../floating-ads/floating-ads.service';

@Controller('upload')
export class UploadController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly floatingAdsService: FloatingAdsService
  ) {}


  @Post('image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadSingle(
    @UploadedFile() file: Express.Multer.File,
    @Query('productId') productId?: string
  ) {
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    // Si productId fourni, associer l'image au produit
    if (productId) {
      const product = await this.productsService.findOne(productId);
      if (!product.images) product.images = [];
      product.images.push(file.filename);
      await this.productsService.update(productId, { images: product.images });
    }

    return {
      message: 'Image uploadée avec succès',
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      url: `/uploads/${file.filename}`,
    };
  }

  @Post('images')
  @UseInterceptors(FilesInterceptor('images', 10))
  async uploadMultiple(
    @UploadedFiles() files: Express.Multer.File[],
    @Query('productId') productId?: string
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    const uploadedFiles = files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      url: `/uploads/${file.filename}`,
    }));

    // Si productId fourni, associer toutes les images au produit
    if (productId) {
      const product = await this.productsService.findOne(productId);
      if (!product.images) product.images = [];
      product.images.push(...files.map(f => f.filename));
      await this.productsService.update(productId, { images: product.images });
    }

    return {
      message: 'Images uploadées avec succès',
      files: uploadedFiles,
    };
  }

  @Post('floating-ad')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFloatingAdImageOnly(
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    return {
      message: 'Image de publicité uploadée avec succès',
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      url: `/uploads/${file.filename}`,
    };
  }

  @Post('floating-ad/:id')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFloatingAdImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') adId: string
  ) {
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    const imageUrl = `/uploads/${file.filename}`;
    // Mettre à jour la publicité avec l'URL de l'image
    await this.floatingAdsService.update(+adId, { imageUrl });

    return {
      message: 'Image de publicité uploadée avec succès',
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      url: imageUrl,
    };
  }

  @Post('header-banner')
  @UseInterceptors(FileInterceptor('file'))
  async uploadHeaderBannerImage(
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    return {
      message: 'Image de bannière header uploadée avec succès',
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      url: `/uploads/${file.filename}`,
    };
  }
}