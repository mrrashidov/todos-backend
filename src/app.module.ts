import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as typeorm from 'typeorm';
import { ColorModule } from './color/color.module';
import { ProjectModule } from './project/project.module';
import { IssueModule } from './issue/issue.module';
import { LabelModule } from './label/label.module';
import { TeamModule } from './team/team.module';
import { FavouriteModule } from './favourite/favourite.module';
import { NotificationModule } from './notification/notification.module';
import { CommentModule } from './comment/comment.module';
import { UserNotificationModule } from './user-notification/user-notification.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root123',
      database: 'ToDo',
      autoLoadEntities:true,
      synchronize: true,
    }),
    UserModule,
    ColorModule,
    ProjectModule,
    IssueModule,
    LabelModule,
    TeamModule,
    FavouriteModule,
    NotificationModule,
    CommentModule,
    UserNotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: typeorm.DataSource) {}
}
