import { Controller, Get, Post, Body, Query, Put, ParseIntPipe } from '@nestjs/common';
import { UserNotificationService } from './user-notification.service';
import { CreateUserNotificationDto } from './dto/create-user-notification.dto';
import { UpdateUserNotificationDto } from './dto/update-user-notification.dto';

@Controller('user-notification')
export class UserNotificationController {
  constructor(private readonly userNotificationService: UserNotificationService) {}

  @Post()
  create(@Body() createUserNotificationDto: CreateUserNotificationDto) {
    return this.userNotificationService.create(createUserNotificationDto);
  }

  @Get(':id')
  findOne(@Query('id', ParseIntPipe) id: number) {
    return this.userNotificationService.findAllByUserId(+id);
  }

  @Put(':id')
  isRead(@Query('id',ParseIntPipe) id: number, @Body() updateUserNotificationDto: UpdateUserNotificationDto) {
    return this.userNotificationService.update(id, updateUserNotificationDto);
  }

  
}
