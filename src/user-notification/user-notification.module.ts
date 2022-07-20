import { Module } from '@nestjs/common';
import { UserNotificationService } from './user-notification.service';
import { UserNotificationController } from './user-notification.controller';
import { UserNotification } from './entities/user-notification.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[TypeOrmModule.forFeature([UserNotification])],

  controllers: [UserNotificationController],
  providers: [UserNotificationService]
})
export class UserNotificationModule {}
