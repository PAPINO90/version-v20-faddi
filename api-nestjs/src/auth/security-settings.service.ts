import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SecuritySettings } from './entities/security-settings.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SecuritySettingsService {
  constructor(
    @InjectRepository(SecuritySettings)
    private securitySettingsRepository: Repository<SecuritySettings>,
  ) {}

  async getMasterCode(): Promise<string> {
    const setting = await this.securitySettingsRepository.findOne({ 
      where: { settingKey: 'MASTER_ACCESS_CODE' } 
    });
    
    // Retourne le code par défaut si aucun n'est défini
    return setting?.settingValue || 'FADIDI2025';
  }

  async updateMasterCode(newCode: string, currentCode: string): Promise<void> {
    // Vérifier que l'ancien code est correct
    const currentMasterCode = await this.getMasterCode();
    if (currentCode !== currentMasterCode) {
      throw new BadRequestException('Code d\'accès actuel incorrect');
    }

    // Valider le nouveau code
    if (!newCode || newCode.length < 6) {
      throw new BadRequestException('Le nouveau code doit contenir au moins 6 caractères');
    }

    if (newCode === currentCode) {
      throw new BadRequestException('Le nouveau code doit être différent de l\'ancien');
    }

    // Mettre à jour ou créer le paramètre
    let setting = await this.securitySettingsRepository.findOne({ 
      where: { settingKey: 'MASTER_ACCESS_CODE' } 
    });

    if (setting) {
      setting.settingValue = newCode;
      setting.description = `Code maître mis à jour le ${new Date().toLocaleString('fr-FR')}`;
    } else {
      setting = this.securitySettingsRepository.create({
        id: uuidv4(),
        settingKey: 'MASTER_ACCESS_CODE',
        settingValue: newCode,
        description: `Code maître créé le ${new Date().toLocaleString('fr-FR')}`
      });
    }

    await this.securitySettingsRepository.save(setting);
  }

  async getSecurityStats(): Promise<any> {
    const settings = await this.securitySettingsRepository.find();
    const masterCodeSetting = settings.find(s => s.settingKey === 'MASTER_ACCESS_CODE');
    
    return {
      masterCodeLastUpdated: masterCodeSetting?.updatedAt || null,
      totalSettings: settings.length,
      hasCustomMasterCode: !!masterCodeSetting
    };
  }
}