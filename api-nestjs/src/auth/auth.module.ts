import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { forwardRef } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { AuthCodesService } from './auth-codes.service';
import { AuthCodesController } from './auth-codes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthCode } from './entities/auth-code.entity';
import { SecuritySettings } from './entities/security-settings.entity';
import { SecuritySettingsService } from './security-settings.service';
import { SecuritySettingsController } from './security-settings.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthCode, SecuritySettings]),
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET') || 'your-secret-key',
        signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') || '1d' },
      }),
      inject: [ConfigService],
    }),
  forwardRef(() => UsersModule),
  ],
  providers: [AuthService, JwtStrategy, AuthCodesService, SecuritySettingsService],
  controllers: [AuthController, AuthCodesController, SecuritySettingsController],
  exports: [AuthService, AuthCodesService, SecuritySettingsService],
})
export class AuthModule {}