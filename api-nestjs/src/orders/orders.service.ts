  import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { Revenue } from './entities/revenue.entity';

@Injectable()
export class OrdersService {
  async findBySource(source: string): Promise<Order[]> {
    return await this.ordersRepository.find({
      where: { source },
      order: { createdAt: 'DESC' }
    });
  }
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(Revenue)
    private revenueRepository: Repository<Revenue>,
  ) {}
  // Met à jour le chiffre d'affaires enregistré
  async updateRevenue(newTotal: number): Promise<Revenue> {
    let revenue = await this.revenueRepository.findOne({ where: {} });
    if (!revenue) {
      revenue = this.revenueRepository.create({ total: newTotal });
    } else {
      revenue.total = newTotal;
    }
    return await this.revenueRepository.save(revenue);
  }

  // Récupère le chiffre d'affaires enregistré
  async getSavedRevenue(): Promise<number> {
    const revenue = await this.revenueRepository.findOne({ where: {} });
    return revenue ? Number(revenue.total) : 0;
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    // Définir un statut par défaut si aucun n'est fourni
    if (!createOrderDto.status) {
      createOrderDto.status = 'pending';
    }
    
    const order = this.ordersRepository.create(createOrderDto);
    return await this.ordersRepository.save(order);
  }

  async findAll(): Promise<Order[]> {
    return await this.ordersRepository.find({
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Order> {
    return await this.ordersRepository.findOne({
      where: { id }
    });
  }

  async findByPhone(phone: string): Promise<Order[]> {
    return await this.ordersRepository.find({
      where: { customerPhone: phone },
      order: { createdAt: 'DESC' }
    });
  }

  async findByStatus(status: string): Promise<Order[]> {
    return await this.ordersRepository.find({
      where: { status },
      order: { createdAt: 'DESC' }
    });
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    await this.ordersRepository.update(id, updateOrderDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.ordersRepository.delete(id);
  }

  async getOrderStats() {
    const totalOrders = await this.ordersRepository.count();
    const pendingOrders = await this.ordersRepository.count({ where: { status: 'pending' } });
    const completedOrders = await this.ordersRepository.count({ where: { status: 'delivered' } });
    
    const totalRevenue = await this.ordersRepository
      .createQueryBuilder('order')
      .select('SUM(order.total)', 'total')
      .where('order.status IN (:...statuses)', { statuses: ['paid', 'processing', 'shipped', 'delivered', 'confirmed'] })
      .getRawOne();

    return {
      totalOrders,
      pendingOrders,
      completedOrders,
      totalRevenue: totalRevenue.total || 0
    };
  }

  async addCustomerFeedback(orderId: number, feedbackData: any): Promise<Order> {
    const order = await this.findOne(orderId);
    if (!order) {
      throw new Error('Commande introuvable');
    }

    // Mettre à jour les champs de retour client
    const updateData: any = {
      customerFeedback: feedbackData.customerFeedback,
      feedbackType: feedbackData.type,
      feedbackDate: new Date(feedbackData.timestamp),
    };

    // Mettre à jour le statut selon le type de retour
    if (feedbackData.type === 'confirmation') {
      updateData.status = 'delivered';
      updateData.deliveredAt = new Date();
    } else if (feedbackData.type === 'problem') {
      updateData.status = 'dispute';
    }

    await this.ordersRepository.update(orderId, updateData);
    return await this.findOne(orderId);
  }

  async getCustomerFeedbacks(): Promise<Order[]> {
    return await this.ordersRepository
      .createQueryBuilder('order')
      .where('order.customerFeedback IS NOT NULL OR order.status = :disputeStatus', { disputeStatus: 'dispute' })
      .orderBy('order.feedbackDate', 'DESC')
      .getMany();
  }

  async respondToFeedback(orderId: number, adminResponse: string): Promise<Order> {
    const updateData = {
      adminResponse: adminResponse,
      adminResponseDate: new Date(),
    };

    await this.ordersRepository.update(orderId, updateData);
    return await this.findOne(orderId);
  }
}