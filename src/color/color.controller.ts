import { Controller, Get, Post, Body, Param, Delete, Put, HttpCode } from '@nestjs/common';
import { catchError, map, Observable, of } from 'rxjs';
import { ColorService } from './color.service';
import { ColorResponse } from './dto/color-interface';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';

@Controller('color')
export class ColorController {
  constructor(private readonly colorService: ColorService) {}

  @Post()
  @HttpCode(200)
  create(@Body() createColorDto: CreateColorDto):Observable<ColorResponse | Object> {
    return this.colorService.create(createColorDto).pipe(
      map((color: ColorResponse)=>createColorDto),
      catchError(err =>of({error:err.message}))
    );
  }

  @Get()
  findAll():Observable<ColorResponse[]> {
    return this.colorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string):Observable<ColorResponse> {
    return this.colorService.findOne(Number(id));
  }

  @Put(':id')
  update(
    @Param('id') id :string,
    @Body() updateColorDto: UpdateColorDto):Observable<ColorResponse> {
    return this.colorService.update(Number(id),updateColorDto);
  }

  
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.colorService.remove(+id);
  }
}
