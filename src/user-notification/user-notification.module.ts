import { Module } from '@nestjs/common';
import { UserNotificationService } from './user-notification.service';
import { UserNotificationController } from './user-notification.controller';
import { UserNotification } from './entities/user-notification.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/user/entities/user.entity';
import { Notification } from '@/notification/entities/notification.entity';

@Module({
  imports:[TypeOrmModule.forFeature([UserNotification,Notification,User])],
  controllers: [UserNotificationController],
  providers: [UserNotificationService]
})
export class UserNotificationModule {}
