import { Module } from '@nestjs/common';
import { LabelService } from './label.service';
import { LabelController } from './label.controller';
import { Label } from './entities/label.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[TypeOrmModule.forFeature([Label])],

  controllers: [LabelController],
  providers: [LabelService]
})
export class LabelModule {}
