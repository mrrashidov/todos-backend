import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createCommentDto: CreateCommentDto){
    return this.commentService.create(createCommentDto);
  }

  @Get(':issueId')
  getAllCommentByIssueId(@Query('issueId',ParseIntPipe) issueId: string):Observable<Comment[]> {
    return this.commentService.getAllCommentByIssueId(+issueId);
  }

  @Get(':projectId')
  getALLCommentByProjectId(@Query('projectId') projectId: number):Observable<Comment[]> {
    return this.commentService.getALLCommentByProjectId(projectId);
  }

  @Put(':id')
  update(@Query('id',ParseIntPipe) id: string, @Body() updateCommentDto: UpdateCommentDto):Observable<Comment> {
    return this.commentService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id',ParseIntPipe) id: string):Observable<any> {
    return this.commentService.remove(+id);
  }
}
