import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscriber } from './subscribers.entity';
import { SubscribersService } from './subscribers.service';
import { SubscribersNotifyService } from './subscribers.notify';
import { SubscribersController } from './subscribers.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Subscriber])],
  providers: [SubscribersService, SubscribersNotifyService],
  controllers: [SubscribersController],
  exports: [SubscribersService],
})
export class SubscribersModule {}
