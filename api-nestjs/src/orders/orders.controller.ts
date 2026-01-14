import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query,
  ParseIntPipe,
  NotFoundException 
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('orders')
export class OrdersController {
  // Endpoint pour mettre à jour le chiffre d'affaires enregistré
  @Post('revenue')
  async saveRevenue(@Body('total') total: number) {
    const revenue = await this.ordersService.updateRevenue(total);
    return {
      success: true,
      data: revenue
    };
  }

  // Endpoint pour récupérer le chiffre d'affaires enregistré
  @Get('revenue')
  async getSavedRevenue() {
    const total = await this.ordersService.getSavedRevenue();
    return {
      success: true,
      total
    };
  }
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    const order = await this.ordersService.create(createOrderDto);
    return {
      success: true,
      message: 'Commande créée avec succès',
      data: order
    };
  }

  @Get()
  async findAll(@Query('status') status?: string, @Query('source') source?: string) {
    let orders;
    if (status) {
      orders = await this.ordersService.findByStatus(status);
    } else if (source) {
      orders = await this.ordersService.findBySource(source);
    } else {
      orders = await this.ordersService.findAll();
    }
    return {
      success: true,
      data: orders
    };
  }

  @Get('stats')
  async getStats() {
    const stats = await this.ordersService.getOrderStats();
    return {
      success: true,
      data: stats
    };
  }

  @Get('by-phone/:phone')
  async findByPhone(@Param('phone') phone: string) {
    const orders = await this.ordersService.findByPhone(phone);
    return {
      success: true,
      data: orders
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const order = await this.ordersService.findOne(id);
    
    if (!order) {
      throw new NotFoundException('Commande non trouvée');
    }
    
    return {
      success: true,
      data: order
    };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateOrderDto: UpdateOrderDto
  ) {
    const order = await this.ordersService.update(id, updateOrderDto);
    
    if (!order) {
      throw new NotFoundException('Commande non trouvée');
    }
    
    return {
      success: true,
      message: 'Commande mise à jour avec succès',
      data: order
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.ordersService.remove(id);
    return {
      success: true,
      message: 'Commande supprimée avec succès'
    };
  }

  @Post('feedback')
  async addFeedback(@Body() feedbackData: any) {
    try {
      const orderId = parseInt(feedbackData.orderId);
      const order = await this.ordersService.addCustomerFeedback(orderId, feedbackData);
      
      return {
        success: true,
        message: 'Retour client enregistré avec succès',
        data: order
      };
    } catch (error) {
      return {
        success: false,
        message: (error instanceof Error ? error.message : 'Erreur inconnue') || 'Erreur lors de l\'enregistrement du retour',
        data: null
      };
    }
  }

  @Get('feedbacks/all')
  async getAllFeedbacks() {
    const feedbacks = await this.ordersService.getCustomerFeedbacks();
    return {
      success: true,
      data: feedbacks
    };
  }

  @Post(':id/admin-response')
  async addAdminResponse(
    @Param('id', ParseIntPipe) id: number,
    @Body() responseData: { response: string }
  ) {
    try {
      const order = await this.ordersService.respondToFeedback(id, responseData.response);
      
      return {
        success: true,
        message: 'Réponse administrateur enregistrée avec succès',
        data: order
      };
    } catch (error) {
      return {
        success: false,
        message: (error instanceof Error ? error.message : 'Erreur inconnue') || 'Erreur lors de l\'enregistrement de la réponse',
        data: null
      };
    }
  }
}