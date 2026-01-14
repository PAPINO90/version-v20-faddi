import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { SecuritySettingsService } from './security-settings.service';

@Controller('security-settings')
export class SecuritySettingsController {
  constructor(private readonly securitySettingsService: SecuritySettingsService) {}

  @Post('update-master-code')
  async updateMasterCode(@Body() body: { currentCode: string; newCode: string; confirmCode: string }) {
    try {
      // Vérifier que les codes correspondent
      if (body.newCode !== body.confirmCode) {
        return { success: false, message: 'Les nouveaux codes ne correspondent pas' };
      }

      await this.securitySettingsService.updateMasterCode(body.newCode, body.currentCode);
      return { success: true, message: 'Code d\'accès maître mis à jour avec succès' };
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : 'Erreur inconnue' };
    }
  }

  @Get('stats')
  async getSecurityStats() {
    try {
      const stats = await this.securitySettingsService.getSecurityStats();
      return { success: true, data: stats };
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : 'Erreur inconnue' };
    }
  }

  @Post('validate-current-code')
  async validateCurrentCode(@Body() body: { code: string }) {
    try {
      const currentCode = await this.securitySettingsService.getMasterCode();
      const isValid = body.code === currentCode;
      return { success: true, valid: isValid };
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : 'Erreur inconnue' };
    }
  }
}