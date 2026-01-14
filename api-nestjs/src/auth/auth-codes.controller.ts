import { Controller, Post, Body } from '@nestjs/common';
import { AuthCodesService } from './auth-codes.service';

@Controller('auth-codes')
export class AuthCodesController {
  constructor(private readonly authCodesService: AuthCodesService) {}

  @Post()
  async generateCode(@Body() body: { label?: string; expiresAt: string }) {
    return this.authCodesService.generateCode(body.label, body.expiresAt);
  }

  @Post('validate')
  async validateCode(@Body() body: { code: string }) {
    try {
      await this.authCodesService.validateCode(body.code);
      return { success: true, message: 'Code valide' };
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : 'Erreur inconnue' };
    }
  }
}
