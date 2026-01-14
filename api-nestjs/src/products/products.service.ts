import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product, ProductStatus } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  async createMany(products: CreateProductDto[]) {
    const created = await this.productsRepository.save(products.map(p => this.productsRepository.create(p)));
    return created;
  }
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productsRepository.create(createProductDto);
    return this.productsRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return this.productsRepository.find({
      relations: ['category'],
      order: { createdAt: 'DESC' },
    });
  }

  async findPublished(): Promise<Product[]> {
    return this.productsRepository.find({
      where: { status: ProductStatus.PUBLISHED },
      relations: ['category'],
      order: { createdAt: 'DESC' },
    });
  }

  async findFeatured(): Promise<Product[]> {
    return this.productsRepository.find({
      where: { 
        status: ProductStatus.PUBLISHED,
        isFeatured: true 
      },
      relations: ['category'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!product) {
      throw new NotFoundException(`Produit avec l'ID ${id} non trouvé`);
    }

    // Incrémenter les vues
    await this.productsRepository.increment({ id }, 'views', 1);

    return product;
  }

  async findByCategory(categoryId: string): Promise<Product[]> {
    return this.productsRepository.find({
      where: { 
        categoryId,
        status: ProductStatus.PUBLISHED 
      },
      relations: ['category'],
      order: { createdAt: 'DESC' },
    });
  }

  async search(query: string): Promise<Product[]> {
    return this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.name LIKE :query', { query: `%${query}%` })
      .orWhere('product.description LIKE :query', { query: `%${query}%` })
      .andWhere('product.status = :status', { status: ProductStatus.PUBLISHED })
      .orderBy('product.createdAt', 'DESC')
      .getMany();
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    
    Object.assign(product, updateProductDto);
    return this.productsRepository.save(product);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    await this.productsRepository.remove(product);
  }

  async updateStatus(id: string, status: ProductStatus): Promise<Product> {
    const product = await this.findOne(id);
    product.status = status;
    return this.productsRepository.save(product);
  }

  async getStats() {
    const [total, published, draft, archived] = await Promise.all([
      this.productsRepository.count(),
      this.productsRepository.count({ where: { status: ProductStatus.PUBLISHED } }),
      this.productsRepository.count({ where: { status: ProductStatus.DRAFT } }),
      this.productsRepository.count({ where: { status: ProductStatus.ARCHIVED } }),
    ]);

    return {
      total,
      published,
      draft,
      archived,
    };
  }
}