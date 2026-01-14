import { Controller, Post, Body, Get, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { SubscribersService } from './subscribers.service';

@Controller('subscribers')
export class SubscribersController {
  constructor(private readonly service: SubscribersService) {}

  @Post()
  async subscribe(@Body('email') email: string, @Body('phone') phone: string) {
    return this.service.subscribe(email, phone);
  }

  @Get()
  async getAll() {
    return this.service.getAll();
  }

  // PATCH /subscribers/:id pour activer/désactiver
  @Patch(':id')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('active') active: boolean
  ) {
    return this.service.updateStatus(id, active);
  }

  // DELETE /subscribers/:id pour supprimer
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
