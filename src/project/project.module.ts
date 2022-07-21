import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { Project } from './entities/project.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { ColorModule } from 'src/color/color.module';
import { Color } from 'src/color/entities/color.entity';
import { Team } from 'src/team/entities/team.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Project,Color,User,Team])],
  controllers: [ProjectController],
  providers: [ProjectService]
})
export class ProjectModule {}
