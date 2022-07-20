import { Module } from '@nestjs/common';
import { FavouriteService } from './favourite.service';
import { FavouriteController } from './favourite.controller';
import { Favourite } from './entities/favourite.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[TypeOrmModule.forFeature([Favourite])],

  controllers: [FavouriteController],
  providers: [FavouriteService]
})
export class FavouriteModule {}
