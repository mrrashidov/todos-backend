import { Module } from '@nestjs/common';
import { LabelService } from './label.service';
import { LabelController } from './label.controller';
import { Label } from './entities/label.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Color } from 'src/color/entities/color.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Label, Color, User])],
  providers: [LabelService],
  controllers: [LabelController],
})
export class LabelModule {}
