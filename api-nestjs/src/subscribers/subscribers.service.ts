import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscriber } from './subscribers.entity';
import { SubscribersNotifyService } from './subscribers.notify';

@Injectable()
export class SubscribersService {
  constructor(
    @InjectRepository(Subscriber)
    private readonly repo: Repository<Subscriber>,
    private readonly notifyService: SubscribersNotifyService,
  ) {}

  async subscribe(email: string, phone: string): Promise<Subscriber> {
    const sub = this.repo.create({ email, phone, notifyByEmail: !!email, notifyBySms: !!phone });
    const saved = await this.repo.save(sub);
    // Optionnel : envoyer un mail de bienvenue ici
    return saved;
  }
  async notifyAllSubscribers(subject: string, message: string) {
    const subs = await this.getAll();
    await this.notifyService.notifyAll(subs, subject, message);
  }

  async getAll(): Promise<Subscriber[]> {
    return this.repo.find(); // Retourne tous les abonnés, actifs et bloqués
  }
  // Met à jour le statut actif/inactif
  async updateStatus(id: number, active: boolean): Promise<Subscriber> {
    const sub = await this.repo.findOneBy({ id });
    if (!sub) throw new Error('Abonné introuvable');
    sub.active = active;
    return this.repo.save(sub);
  }

  // Supprime un abonné
  async remove(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
