import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum DisplayMode {
  TOAST = 'toast',
  POPUP = 'popup',
  BANNER = 'banner'
}

export enum Position {
  TOP_LEFT = 'top-left',
  TOP_RIGHT = 'top-right',
  TOP_CENTER = 'top-center',
  BOTTOM_LEFT = 'bottom-left',
  BOTTOM_RIGHT = 'bottom-right',
  BOTTOM_CENTER = 'bottom-center',
  CENTER = 'center'
}

@Entity('floating_ads')
export class FloatingAd {
  @Column({ type: 'int', default: 0, nullable: true, comment: 'Délai de réaffichage après fermeture (secondes)' })
  redisplayDelay?: number;
  @Column({ type: 'int', default: 0, nullable: true, comment: 'Durée d\'affichage de la publicité en millisecondes' })
  displayDuration?: number;
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ 
    type: 'enum', 
    enum: DisplayMode,
    default: DisplayMode.BANNER
  })
  displayMode: DisplayMode;

  @Column({ 
    type: 'enum', 
    enum: Position,
    default: Position.BOTTOM_RIGHT
  })
  position: Position;


  @Column({ type: 'varchar', length: 50, default: '300px' })
  width: string;

  @Column({ type: 'varchar', length: 50, default: '200px' })
  height: string;

  @Column({ type: 'varchar', length: 16, default: '#ffffff', comment: 'Couleur de fond (hex ou transparent)' })
  backgroundColor: string;

  @Column({ type: 'varchar', length: 16, default: '#000000', comment: 'Couleur du texte (hex ou transparent)' })
  textColor: string;

  @Column({ type: 'text', nullable: true, comment: 'Pages où afficher (séparées par virgule, * pour toutes)' })
  targetPages: string;

  @Column({ type: 'varchar', length: 500, nullable: true, comment: 'URL de redirection lors du clic' })
  redirectUrl: string;

  @Column({ type: 'varchar', length: 500, nullable: true, comment: 'URL de l\'image' })
  imageUrl: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'datetime', nullable: true })
  startDate: Date;

  @Column({ type: 'datetime', nullable: true })
  endDate: Date;

  @Column({ type: 'int', default: 0, comment: 'Nombre de clics' })
  clickCount: number;

  @Column({ type: 'int', default: 0, comment: 'Nombre d\'affichages' })
  viewCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}