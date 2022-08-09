import { Notification } from '@/notification/entities/notification.entity';
import { User } from '@/user/entities/user.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map, Observable, switchMap } from 'rxjs';
import { Any, Repository } from 'typeorm';
import { CreateUserNotificationDto } from './dto/create-user-notification.dto';
import { MailDto } from './dto/emailDto';
import { UpdateUserNotificationDto } from './dto/update-user-notification.dto';
import { UserNotification } from './entities/user-notification.entity';

@Injectable()
export class UserNotificationService {
  

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,

    @InjectRepository(UserNotification)
    private userNotificationRepository: Repository<UserNotification>,

    private mailService: MailerService
  ) { }


  create(createUserNotificationDto: CreateUserNotificationDto): Observable<UserNotification> {

    return this.checkUserAndGet(createUserNotificationDto.userId).pipe(
      switchMap((user: User) => {
        if (user !== undefined) {
          return this.findNotificationById(createUserNotificationDto.notification).pipe(
            switchMap((notification: Notification) => {
              if (notification !== undefined) {
                const userNotif = new UserNotification()
                userNotif.notification = notification
                userNotif.user = user
                return from(this.userNotificationRepository.save(userNotif)).pipe(
                  map((userNotif: UserNotification) => userNotif)
                )

              }else{
                throw new HttpException(
                  'Notification doesnot exist',
                  HttpStatus.BAD_REQUEST,
                );
              }
            })
          )
        }else{
          throw new HttpException(
            'User doesnot exist',
            HttpStatus.BAD_REQUEST,
          );
        }
      })
    )
  }

  private findNotificationById(id: number): Observable<Notification> {
    return from(this.notificationRepository.findOneBy({ id }))
  }

  private checkUserAndGet(id: number): Observable<User> {
    return from(this.userRepository.findOneBy({ id }))
  }

  findAllByUserId(id: number): Observable<UserNotification[]> {

    return this.checkUserAndGet(id).pipe(
      switchMap((user: User) => {
        if (user !== undefined) {
          return this.findByUserId(user).pipe(
            map((userNotif: UserNotification[]) => userNotif)
          )
        }else{
          throw new HttpException(
            'User doesnot exist',
            HttpStatus.BAD_REQUEST,
          );
        }
      })
    )
  }
  private findByUserId(user: User): Observable<UserNotification[]> {
    return from(this.userNotificationRepository.find({ relations: ['user', 'notification'], where: { user: { id: user.id } } }))
  }

  update(id: number, updateUserNotificationDto: UpdateUserNotificationDto): Observable<UserNotification> {
    return this.findById(id).pipe(
      switchMap((userNotif: UserNotification)=>{
        if(userNotif !== undefined){
          userNotif.read = updateUserNotificationDto.isRead
          userNotif.readAt = updateUserNotificationDto.readDate
          return from(this.userNotificationRepository.save(userNotif)).pipe(
            map((userNotif: UserNotification)=> userNotif)
          )
        }else{
          throw new HttpException(
            'User Notificatioins does not exist',
            HttpStatus.BAD_REQUEST,
          );
        }
      })
    )
  }
private findById(id: number): Observable<UserNotification>{
  return from(this.userNotificationRepository.findOneBy({id}))
}


 sendNotifToGmail(maildto: MailDto): Observable<Response>{
return from(this.mailService.sendMail({
  to: maildto.mail,
  from: "mirzaqosimovafarzona@gmail.com",
  subject: maildto.subject,
  text: maildto.text,
}))
 }


}
