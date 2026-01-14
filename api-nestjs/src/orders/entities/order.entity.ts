import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  customerName: string;

  @Column()
  customerPhone: string;

  @Column({ nullable: true })
  customerEmail: string;

  @Column('text')
  deliveryAddress: string;

  @Column()
  deliveryCity: string;

  @Column({ nullable: true })
  deliveryTime: string;

  @Column({ type: 'text', nullable: true })
  deliveryNotes: string;

  @Column('json')
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    total: number;
  }>;

  @Column('decimal', { precision: 10, scale: 2 })
  subtotal: number;

  @Column('decimal', { precision: 10, scale: 2 })
  deliveryFee: number;

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @Column()
  paymentMethod: string;

  @Column()
  status: string;

  // Ajout : source de la commande (ex: 'haut-game')
  @Column({ nullable: true })
  source: string;
  paymentDate: Date;

  @Column({ type: 'text', nullable: true })
  customerFeedback: string;

  @Column({ nullable: true })
  feedbackType: string;

  @Column({ type: 'timestamp', nullable: true })
  feedbackDate: Date;

  @Column({ type: 'text', nullable: true })
  adminResponse: string;

  @Column({ type: 'timestamp', nullable: true })
  adminResponseDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  deliveredAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}