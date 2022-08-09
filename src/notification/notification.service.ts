import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map, Observable, switchMap } from 'rxjs';
import { Comment } from 'src/comment/entities/comment.entity';
import { ModelType } from 'src/enum/ModelType';
import { Team } from '../team/entities/team.entity';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationService {
  
  constructor(

    @InjectRepository(User)
    private userRepository: Repository<User>,
    
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,


    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>
  ) { }

  create(createNotificationDto: CreateNotificationDto): Observable<Notification> {
    const notification =  this.notificationRepository.create({
    body : createNotificationDto.body,
    subject: createNotificationDto.subject
   })

  return this.findByModelTypeAndId(createNotificationDto).pipe(
    switchMap((result: Comment|Team)=>{
      if(result !== undefined){
        notification.modelId = createNotificationDto.modelId
        notification.modelType = createNotificationDto.modelType
        return from(this.notificationRepository.save(notification)).pipe(
          map((createdNotif: Notification)=> createdNotif )
        )
      }else{
        throw new HttpException(
          'Model type or Model Id was wrong',
          HttpStatus.BAD_REQUEST,
        );
      }
    })
  )
 
}

private findByModelTypeAndId(createDto: CreateNotificationDto): Observable<Comment|Team>  {
  if(createDto.modelType == ModelType.COMMENT){
    return from(this.commentRepository.findOneBy({id: createDto.modelId}));
  } else if(createDto.modelType == ModelType.TEAM){
    return from(this.teamRepository.findOneBy({id: createDto.modelId}));
  
  }
}






}
