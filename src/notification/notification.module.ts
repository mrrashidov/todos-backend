import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { Notification } from './entities/notification.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Issue } from '@/issue/entities/issue.entity';
import { User } from '@/user/entities/user.entity';
import { UserNotification } from '@/user-notification/entities/user-notification.entity';
import { Project } from '@/project/entities/project.entity';
import { Team } from '@/team/entities/team.entity';
import { Comment } from '@/comment/entities/comment.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Notification,Issue,User,UserNotification,Project,Team,Comment])],
  controllers: [NotificationController],
  providers: [NotificationService]
})
export class NotificationModule {}
