import { Controller, Get, Post, Body, Param, Delete, Put, HttpCode } from '@nestjs/common';
import { ColorService } from './color.service';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';

@Controller('color')
export class ColorController {
  constructor(private readonly colorService: ColorService) {}

  @Post()
  @HttpCode(200)
  create(@Body() createColorDto: CreateColorDto) {
    return this.colorService.create(createColorDto);
  }

  @Get()
  findAll() {
    return this.colorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.colorService.findOne(+id);
  }

  @Put()
  update(@Body() updateColorDto: UpdateColorDto) {
    return this.colorService.update(updateColorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.colorService.remove(+id);
  }
}
