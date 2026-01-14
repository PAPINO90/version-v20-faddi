import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { AnnonceImage } from './annonce-image.entity';

@Entity('annonces')
export class Annonce {
  @Column({ type: 'int', default: 0 })
  vuesIndex: number;

  @Column({ type: 'int', default: 0 })
  clicsIndex: number;
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column()
  titre: string;

  @Column('text')
  description: string;

  @Column()
  pageCible: string;

  @Column({ nullable: true })
  redirectionUrl: string;

  @Column({ nullable: true })
  animation: string;

  @Column({ default: true })
  active: boolean;

  @Column({ type: 'int', default: 0 })
  vues: number;

  @Column({ type: 'int', default: 0 })
  clics: number;

  @OneToMany(() => AnnonceImage, img => img.annonce, { cascade: true })
  images: AnnonceImage[];
}
