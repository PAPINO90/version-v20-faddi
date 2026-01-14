import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

// Modules
import { AuthModule } from './auth/auth.module';
import { SubscribersModule } from './subscribers/subscribers.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { UsersModule } from './users/users.module';
import { UploadModule } from './upload/upload.module';
import { OrdersModule } from './orders/orders.module';
import { PromotionsModule } from './promotions/promotions.module';
import { FloatingAdsModule } from './floating-ads/floating-ads.module';
import { AnnoncesModule } from './annonces/annonces.module';
import { HeaderBannersModule } from './header-banners/header-banners.module';

// Entities
import { User } from './users/entities/user.entity';
import { Product } from './products/entities/product.entity';
import { Category } from './categories/entities/category.entity';
import { Order } from './orders/entities/order.entity';
import { Revenue } from './orders/entities/revenue.entity';
import { Promotion } from './promotions/entities/promotion.entity';
import { AuthCode } from './auth/entities/auth-code.entity';
import { SecuritySettings } from './auth/entities/security-settings.entity';
import { FloatingAd } from './floating-ads/entities/floating-ad.entity';
import { Annonce } from './annonces/annonce.entity';
import { AnnonceImage } from './annonces/annonce-image.entity';
import { Subscriber } from './subscribers/subscribers.entity';
import { HeaderBanner } from './header-banners/entities/header-banner.entity';

@Module({
  imports: [
    // Configuration globale
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Configuration TypeORM avec MySQL
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST') || 'localhost',
        port: +configService.get('DB_PORT') || 3306,
        username: configService.get('DB_USERNAME') || 'root',
        password: configService.get('DB_PASSWORD') || '',
        database: process.env.DATABASE_NAME || 'fadidi_new_db',
  entities: [User, Product, Category, Order, Promotion, AuthCode, SecuritySettings, FloatingAd, Annonce, AnnonceImage, Subscriber, Revenue, HeaderBanner],
        synchronize: true, // À désactiver en production
        logging: true,
        charset: 'utf8mb4',
      }),
      inject: [ConfigService],
    }),

    // Servir les fichiers statiques (images uploadées)
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads/',
    }),

    // Modules de l'application
  AuthModule,
  SubscribersModule,
  ProductsModule,
  CategoriesModule,
  UsersModule,
  UploadModule,
  OrdersModule,
  PromotionsModule,
  FloatingAdsModule,
  AnnoncesModule,
  HeaderBannersModule,
  ],
})
export class AppModule {}