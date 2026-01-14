import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Annonce } from './annonce.entity';

@Entity('annonce_images')
export class AnnonceImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titre: string;

  @Column('text')
  description: string;

  @Column()
  type: string;

  @Column('longtext')
  imageBase64: string;

  @ManyToOne(() => Annonce, annonce => annonce.images)
  @JoinColumn({ name: 'annonce_id' })
  annonce: Annonce;
}