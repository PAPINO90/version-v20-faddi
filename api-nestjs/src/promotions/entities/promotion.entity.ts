import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { Category } from '../../categories/entities/category.entity';

export enum PromotionStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  EXPIRED = 'expired',
  PAUSED = 'paused'
}

@Entity('promotions')
export class Promotion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  originalPrice: number;

  @Column('decimal', { precision: 10, scale: 2 })
  promotionPrice: number;

  @Column('decimal', { precision: 5, scale: 2 })
  discountPercentage: number;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column({
    type: 'enum',
    enum: PromotionStatus,
    default: PromotionStatus.DRAFT,
  })
  status: PromotionStatus;

  @Column({ nullable: true })
  image: string;

  @Column({ default: 0 })
  maxQuantity: number; // Limite de stock en promotion (0 = illimité)

  @Column({ default: 0 })
  soldQuantity: number; // Quantité vendue en promotion

  @Column({ default: false })
  isFeatured: boolean; // Promotion mise en avant

  @Column('simple-array', { nullable: true })
  tags: string[];

  // Relations avec Product
  @ManyToOne(() => Product, { nullable: true })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ nullable: true })
  productId: string;

  // Relations avec Category
  @ManyToOne(() => Category, { nullable: true })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column({ nullable: true })
  categoryId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Propriété calculée pour les jours restants
  get daysRemaining(): number {
    const now = new Date();
    const end = new Date(this.endDate);
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }

  // Propriété calculée pour le pourcentage de temps restant
  get timeRemainingPercentage(): number {
    const now = new Date();
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    const total = end.getTime() - start.getTime();
    const remaining = end.getTime() - now.getTime();
    
    if (total <= 0 || remaining <= 0) return 0;
    if (remaining >= total) return 100;
    
    return Math.round((remaining / total) * 100);
  }

  // Vérifier si la promotion est active
  get isActive(): boolean {
    const now = new Date();
    return this.status === PromotionStatus.ACTIVE && 
           now >= this.startDate && 
           now <= this.endDate &&
           (this.maxQuantity === 0 || this.soldQuantity < this.maxQuantity);
  }
}