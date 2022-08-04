import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map, Observable, switchMap } from 'rxjs';
import { Color } from 'src/color/entities/color.entity';
import { Team } from 'src/team/entities/team.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { AllProjects } from './dto/select.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectService {

  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Color)
    private colorRepository: Repository<Color>,

    @InjectRepository(Team)
    private teamRepository: Repository<Team>

  ) { }


  create(createProjectDto: CreateProjectDto): Observable<Project> {
    const project = this.projectRepository.create({
      name: createProjectDto.name,
      createdAt: new Date(),
    });

    return this.findUserById(createProjectDto.userId).pipe(
      switchMap((user: User) => {
        if (user != null) {
          project.user = user;
          return this.findByColorId(createProjectDto.colorId).pipe(
            switchMap((color: Color) => {
              if (color != null) {
                project.color = color;
                if (createProjectDto.parentProjectId != null) {
                  return this.findByProjectId(createProjectDto.parentProjectId).pipe(
                    switchMap((prproject: Project) => {
                      if (prproject.parentProject == null) {
                        project.parentProject = prproject
                        return from(this.projectRepository.save(project)).pipe(
                          map((project: Project) => {
                            return project;
                          })
                        )
                      }
                    }))
                } else {
                  return from(this.projectRepository.save(project)).pipe(
                    map((project: Project) => {
                      return project;
                    }))
                }
              }
            })
          )
        }
      })
    )
  }

  findAllByUserId(userId: number): Observable<AllProjects> {
    return this.findUserById(userId).pipe(
      switchMap((user: User) => {
        if (user != null) {
          return this.findUserTeamProjects(user).pipe(
            switchMap((teamProjects: Project[]) => {
              return this.findUserOwnProjects(user).pipe(
                map((ownProjects: Project[]) => ({
                  team: teamProjects,
                  own: ownProjects
                }))
              )
            })
          )
        }
      })
    )
  }


  update(projectId: number, updateProjectDto: UpdateProjectDto): Observable<Project> {
    return this.findByProjectId(projectId).pipe(
      switchMap((project: Project) => {
        project.name = updateProjectDto.name;
        return this.findByColorId(updateProjectDto.colorId).pipe(
          switchMap((color: Color) => {
            project.color = color;
            return from(this.projectRepository.save(project)).pipe(
              map((savedProject: Project) => {
                return savedProject;
              })
            )
          })
        )
      })
    )
  }

  remove(projectId: number, userId: number): Observable<String> {
    return this.findByProjectId(projectId).pipe(
      switchMap((project: Project) => {
        return this.findTeamfromProjectId(projectId).pipe(
          switchMap((team: Team) => {
            if (project.user.id == userId && team == null) {
              project.isDelete = true;
              from(this.projectRepository.save(project)).pipe(

              )
            } else if (team != null && project.user.id == userId) {
              project.isDelete = true;
              from(this.projectRepository.save(project))
              from(this.teamRepository.remove(team))
            } else {
              const user = team.user.find((obj) => {
                return obj.id == userId;
              });
              if (user != null) {
                team.user.forEach((element, index) => {
                  if (element.id == user.id) delete team.user[index];
                });
                from(this.teamRepository.save(team));

              }
            }
            return 'DELETED';
          })
        )
      })
    )
  }

  private findByProjectId(id: number): Observable<Project> {
    return from(this.projectRepository.findOne({ where: { id }, relations: ['parentProject', 'user'] })
    )
  }

  private findByColorId(id: number): Observable<Color> {
    return from(this.colorRepository.findOneBy({ id }))
  }

  private findUserById(id: number): Observable<User> {
    return from(this.userRepository.findOneBy({ id }))
  }

  private findUserTeamProjects(user: User): Observable<Project[]> {
    return from(this.teamRepository.query(
      `select p.* from team join team_user_users tuu on team.id = tuu."teamId" join project p on p.id = team."projectId" where tuu."usersId" = ${user.id} `,
    ));
  }
  private findUserOwnProjects(user: User): Observable<Project[]> {
    return from(this.teamRepository.query(
      `select * from project  left join  team  tpp on project.id = tpp."projectId"  where project."userId" = ${user.id}  and tpp."projectId" is null and project."parentProjectId" is null and project."isDelete" = false`,
    ));
  }

  private findTeamfromProjectId(projectId: number): Observable<Team> {
    return from(this.teamRepository.findOne({
      where: { project: { id: projectId } },
      relations: ['user'],
    }))
  }


  
}
