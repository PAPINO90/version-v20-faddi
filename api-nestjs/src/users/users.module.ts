import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { forwardRef } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => AuthModule)],
  controllers: [require('./users.controller').UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {
  constructor(private usersService: UsersService) {
    // Créer l'administrateur par défaut au démarrage
    this.usersService.createDefaultAdmin().catch(console.error);
  }
}