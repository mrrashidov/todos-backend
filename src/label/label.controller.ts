import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Put,
  HttpCode,
  Query,
} from '@nestjs/common';
import { LabelService } from './label.service';
import { CreateLabelDto } from './dto/create-label.dto';
import { UpdateLabelDto } from './dto/update-label.dto';
import { catchError, Observable, of } from 'rxjs';
import { LabelResponse } from './dto/label-interface';

@Controller('label')
export class LabelController {
  constructor(private readonly labelService: LabelService) { }

  @Post()
  @HttpCode(200)
  create(
    @Body() createLabel: CreateLabelDto) {
    return this.labelService.create(createLabel)
  }
  @Get(':userId')
  findAllLabel(@Query('userId') userId: number) {
    if (userId == null) {
      catchError((err) => of({ error: err.message }))
    } else {
      return this.labelService.findByUser(userId);
    }
  }

  @Put()
  update(@Query('id') id: number, @Body() updateLabelDto: UpdateLabelDto) {
    return this.labelService.update(+id, updateLabelDto);
  }

  @Delete()
  remove(@Query('id') id: number) {
    return this.labelService.remove(+id);
  }

  @Get()
  findAllForAdmin(): Observable<LabelResponse[]> {
    return this.labelService.findAllForAdmin();
  }
}
