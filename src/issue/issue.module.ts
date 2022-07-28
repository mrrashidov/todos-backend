import { Module } from '@nestjs/common';
import { IssueService } from './issue.service';
import { IssueController } from './issue.controller';
import { Issue } from './entities/issue.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from 'src/project/entities/project.entity';
import { Color } from 'src/color/entities/color.entity';
import { User } from 'src/user/entities/user.entity';
import { Label } from 'src/label/entities/label.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Issue,Project,Color,User,Label])],
  controllers: [IssueController],
  providers: [IssueService],
})
export class IssueModule {}
