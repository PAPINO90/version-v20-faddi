import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('subscribers')
export class Subscriber {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ default: true })
  notifyByEmail: boolean;

  @Column({ default: false })
  notifyBySms: boolean;

  @Column({ default: true })
  active: boolean;
}
