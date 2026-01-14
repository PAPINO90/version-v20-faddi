import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthCode } from './entities/auth-code.entity';
import { SecuritySettingsService } from './security-settings.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthCodesService {
  constructor(
    @InjectRepository(AuthCode)
    private authCodeRepository: Repository<AuthCode>,
    private securitySettingsService: SecuritySettingsService,
  ) {}

  async generateCode(label: string | undefined, expiresAt: string) {
    const generatedCode = Math.random().toString(36).substr(2, 8).toUpperCase();
    const codeEntity = this.authCodeRepository.create({
      id: uuidv4(),
      code: generatedCode,
      label: label || '',
      expiresAt: new Date(expiresAt),
      isUsed: false,
    });
    await this.authCodeRepository.save(codeEntity);
    return {
      code: generatedCode,
      label: label || '',
      expiresAt,
    };
  }

  async validateCode(code: string): Promise<void> {
    // Récupérer le code maître dynamique
    const masterCode = await this.securitySettingsService.getMasterCode();
    if (code === masterCode) {
      return; // Code maître valide
    }

    const codeEntity = await this.authCodeRepository.findOne({ where: { code } });
    if (!codeEntity) {
      throw new BadRequestException('Code d\'autorisation invalide');
    }
    if (codeEntity.isUsed) {
      throw new BadRequestException('Code déjà utilisé');
    }
    if (new Date() > new Date(codeEntity.expiresAt)) {
      throw new BadRequestException('Code expiré');
    }
    // Marquer comme utilisé
    codeEntity.isUsed = true;
    await this.authCodeRepository.save(codeEntity);
  }
}
