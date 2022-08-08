import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  ValidationPipe,
  UsePipes,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { FavouriteService } from './favourite.service';
import { CreateFavouriteDto } from './dto/create-favourite.dto';
import { catchError, of } from 'rxjs';

@Controller('favourite')
export class FavouriteController {
  constructor(private readonly favouriteService: FavouriteService) { }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createFavouriteDto: CreateFavouriteDto) {
    return this.favouriteService.create(createFavouriteDto);
  }

  @Get(':userId')
  findByUser(@Query('userId') userId: number) {
    if (userId == null) {
      catchError((err) => of({ error: err.message }))
    } else {
      return this.favouriteService.findByUser(userId);
    }
  }

  @Delete(':id')
  remove(@Query('id', ParseIntPipe) id: number) {
    return this.favouriteService.remove(+id);
  }
}
