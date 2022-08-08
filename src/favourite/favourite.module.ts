import { Module } from '@nestjs/common';
import { FavouriteService } from './favourite.service';
import { FavouriteController } from './favourite.controller';
import { Favourite } from './entities/favourite.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Project } from 'src/project/entities/project.entity';
import { Label } from 'src/label/entities/label.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Favourite,User,Label,Project])],
  controllers: [FavouriteController],
  providers: [FavouriteService],
})
export class FavouriteModule {}
