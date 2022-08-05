import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
  Query,
} from '@nestjs/common';
import { catchError, map, Observable, of } from 'rxjs';
import { ColorService } from './color.service';
import { ColorResponse } from './dto/color-interface';
import { CreateColorDto } from './dto/create-color.dto';

@Controller('color')
export class ColorController {
  constructor(private readonly colorService: ColorService) {}

  @Post()
  @HttpCode(200)
  create(
    @Body() createColorDto: CreateColorDto,
  ): Observable<ColorResponse|object> {
    return this.colorService.create(createColorDto).pipe(
      map((color: ColorResponse) => createColorDto),
      catchError((err) => of({ error: err.message })),
    );
  }

  @Get()
  findAll(): Observable<ColorResponse[]> {
    return this.colorService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.colorService.remove(+id);
  }
}
