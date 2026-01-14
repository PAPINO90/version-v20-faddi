import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('header_banners')
export class HeaderBanner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 500 })
  imageUrl: string;

  @Column({ length: 500, nullable: true })
  linkUrl: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 0 })
  displayOrder: number;

  @Column({ default: 5000 })
  displayDuration: number; // Durée d'affichage en millisecondes

  @Column({ type: 'text', nullable: true })
  customStyles: string; // CSS personnalisé pour la bannière

  @Column({ length: 20, default: 'center' })
  imagePosition: string; // Position de l'image: 'left', 'center', 'right'

  @Column({ default: 0 })
  viewCount: number; // Nombre de vues de la bannière

  @Column({ default: 0 })
  clickCount: number; // Nombre de clics sur la bannière

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}