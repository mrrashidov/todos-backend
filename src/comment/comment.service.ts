import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map, Observable, switchMap } from 'rxjs';
import { Issue } from '../issue/entities/issue.entity';
import { Project } from '../project/entities/project.entity';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';
import { ModelType } from 'src/enum/model-type';


@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Issue)
    private issueRepository: Repository<Issue>,

    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) { }

  async create(createCommentDto: CreateCommentDto) {
    const [user, comment] = await Promise.all([
      this.userRepository.findOne({ where: { id: createCommentDto.userId } }),
      this.commentRepository.create(createCommentDto)
    ]);
    if (user) {
      if (createCommentDto.modelType == ModelType.PROJECT) {
        const project = await this.projectRepository.findOne({ where: { id: createCommentDto.modelId }, relations: ['user'] })
        if (project != undefined && project.user == user) {
          comment.modelId = project.id;
          comment.modelType = ModelType.PROJECT;
        } else {
          throw new HttpException('You have not this project', HttpStatus.NOT_FOUND);
        }
      }
      if (createCommentDto.modelType == ModelType.LABEL) {
        const issue = await this.issueRepository.findOne({ where: { id: createCommentDto.modelId }, relations: ['user'] })
        if (issue != undefined && issue.user.id == user.id) {
          comment.modelId = issue.id;
          comment.modelType = ModelType.ISSUE
        } else {
          throw new HttpException('You have not this issue', HttpStatus.NOT_FOUND);
        }
      } else {
        throw new HttpException('Type error,try again', HttpStatus.BAD_REQUEST)
      }
      comment.user = user;
      comment.text = createCommentDto.text
      return from(this.commentRepository.save(comment));
    }

  }

  getALLCommentByProjectId(projectId: number): Observable<Comment[]> {
    return from(this.commentRepository.query(`select c.id,c."modelId",c."modelType",p.name from comment c left join project p on c."modelId"=p.id where c."modelType"='project' and c."modelId"=${projectId};`));
  }

  getAllCommentByIssueId(issueId: number): Observable<Comment[]> {
    return from(this.commentRepository.query(`select c.id,c."modelId",c."modelType",is.name from comment c left join issue is  on c."modelId"=is.id where c."modelType"='issue' and c."modelId"=${issueId};`));
  }

  update(id: number, updateCommentDto: UpdateCommentDto): Observable<Comment> {
    return this.findCommet(id).pipe(
      switchMap((comment: Comment) => {
        comment.text = updateCommentDto.text
        return this.findByUserId(updateCommentDto.userId).pipe(
          switchMap((user: User) => {
            comment.user = user;
            return from(this.commentRepository.save(comment)).pipe(
              map((newComment: Comment) => newComment)
            )
          })
        )
      })
    )
  }

  private findByUserId(id: number): Observable<User> {
    return from(this.userRepository.findOneBy({ id }))
  }

  remove(id: number): Observable<any> {
    const user = this.findCommet(id);
    if (!user) {
      throw new HttpException('User not found, please try again.', HttpStatus.NOT_FOUND);
    }
    return from(this.commentRepository.delete({ id }));
  }

  findCommet(id: number): Observable<Comment> {
    return from(this.commentRepository.findOneBy({ id })
      .then((comment: Comment) => comment)
      .catch(error => error))
  }
}
