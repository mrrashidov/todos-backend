import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { not } from 'joi';
import { from, map, Observable, Subscription, switchMap } from 'rxjs';
import { Color } from 'src/color/entities/color.entity';
import { IssueStatus } from 'src/enum/IssueStatus';
import { Label } from 'src/label/entities/label.entity';
import { Project } from 'src/project/entities/project.entity';
import { User } from 'src/user/entities/user.entity';
import { Any, Repository } from 'typeorm';
import { CreateIssueDto } from './dto/create-issue.dto';
import { SelectIssue } from './dto/selectIssue';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { Issue } from './entities/issue.entity';

@Injectable()
export class IssueService {
  constructor(
    @InjectRepository(Issue)
    private issueRepository: Repository<Issue>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Color)
    private colorRepository: Repository<Color>,

    @InjectRepository(Project)
    private projectRepository: Repository<Project>,

    @InjectRepository(Label)
    private labelRepository: Repository<Label>,
  ) { }

  create(createIssueDto: CreateIssueDto): Observable<string | Issue> {
    const issue = this.issueRepository.create({
      title: createIssueDto.title,
      dueDate: createIssueDto.dueDate,
      createdAt: new Date(),
      priority: createIssueDto.priority,
      status: IssueStatus.ACTIVE,
    });
    if (createIssueDto.description != null) {
      issue.description = createIssueDto.description;
    }

    return this.findByColorId(createIssueDto.colorId).pipe(
      switchMap((color: Color) => {
        if (color != null) {
          issue.colors = color;
          if (createIssueDto.labels != null) {
            return this.findLabelsByIds(createIssueDto.labels).pipe(
              switchMap((labels: Label[]) => {
                issue.labels = labels;
                return this.findUserById(createIssueDto.userId).pipe(
                  switchMap((user: User) => {
                    issue.user = user;
                    if (
                      (createIssueDto.parentIssueId != null &&
                        createIssueDto.parentIssueId != null) ||
                      (createIssueDto.parentIssueId == null &&
                        createIssueDto.parentIssueId == null)
                    ) {
                      throw new HttpException(
                        'One of parent or project id must be null',
                        HttpStatus.BAD_REQUEST,
                      );
                    } else if (createIssueDto.parentIssueId != null) {
                      return this.findByIssueId(
                        createIssueDto.parentIssueId,
                      ).pipe(
                        switchMap((prIssue: Issue) => {
                          if (prIssue.parentIssue == null) {
                            issue.parentIssue = prIssue;
                            return from(this.issueRepository.save(issue)).pipe(
                              map((createdIssue: Issue) => {
                                return createdIssue;
                              }),
                            );
                          }
                        }),
                      );
                    } else if (createIssueDto.projectId != null) {
                      return this.findByProjectId(
                        createIssueDto.projectId,
                      ).pipe(
                        switchMap((project: Project) => {
                          if (project.parentProject != null) {
                            issue.project = project;
                            return from(this.issueRepository.save(issue)).pipe(
                              map((createdIssue: Issue) => {
                                return createdIssue;
                              }),
                            );
                          }
                        }),
                      );
                    }
                  }),
                );
              }),
            );
          }
        }
      }),
    );
  }

  findIssuesByProjectId(id: number): Observable<Project[]> {
    return this.findSectionsIdsProjectId(id).pipe(
      switchMap((ids: number[]) => {
        return this.findAllIssuesBySectionId(ids).pipe(
          map((projectswithIssue: Project[]) => {
            return projectswithIssue;
          }),
        );
      }),
    );
  }
 
  update(id: number, updateIssueDto: UpdateIssueDto): Observable<Issue>  {

    return this.findByIssueId(id).pipe(
      switchMap((issue: Issue) => {
        if (issue != null) {
          if (updateIssueDto.description != null) {
            issue.description = updateIssueDto.description
          }
          if (updateIssueDto.title != null) {
            issue.title = updateIssueDto.title;
          }
          if (updateIssueDto.dueDate != null) {
            issue.dueDate = updateIssueDto.dueDate
          }
            if (updateIssueDto.priority != null) {
              issue.priority = updateIssueDto.priority
            }

            if (updateIssueDto.colorId != null) {
              this.findByColorId(updateIssueDto.colorId).subscribe(col => { issue.colors = col });

            }
          
          if (updateIssueDto.labels != null) {
             this.findLabelsByIds(updateIssueDto.labels).subscribe(labels => { issue.labels = labels })
          }
          if (updateIssueDto.projectId != null) {
             this.findByProjectId(updateIssueDto.projectId).subscribe(project => { issue.project = project })
          }
          return from(this.issueRepository.save(issue)).pipe(
            map((editedIssue: Issue) => editedIssue)
          )
        } else{
        throw new HttpException(
          'Sorry,we dont have this issue',
          HttpStatus.BAD_REQUEST,
        );
        }
       })
    );
  }

  remove(id: number): Observable<boolean> {
    return this.findByIssueId(id).pipe(
      switchMap((issue:Issue)=>{
         issue.status = IssueStatus.DELETE
        from(this.issueRepository.save(issue))

     if(issue.parentIssue !== undefined){

    return  this.findIssueByParent(issue).pipe(
      map((issues: Issue[])=>{
        if(issue != null){
       for(const  childIssue of issues){
       childIssue.status = IssueStatus.DELETE
       from(this.issueRepository.save(childIssue))
     }
     return true;
    }
  })
 )
        }
      })
    );
  }




  private findByIssueId(id: number): Observable<Issue> {
    return from(
      this.issueRepository.findOne({
        where: { id },
        relations: ['parentIssue'],
      }),
    );
  }

  private findByColorId(id: number): Observable<Color> {
    return from(this.colorRepository.findOneBy({ id }));
  }

  findOne(id: number): Observable<SelectIssue> {
    return this.findByIssueId(id).pipe(
      switchMap((parentIssue: Issue) => {
        if (parentIssue !== undefined && parentIssue.status !== IssueStatus.DELETE) {          
          return this.findIssueByParent(parentIssue).pipe(
            map((issues: Issue[]) => {
              return {
              parentIssue: parentIssue,
              childIssue: issues
            }
            })
          )
        }  throw new HttpException(
          'Sorry,we dont have this issue',
          HttpStatus.BAD_REQUEST,
        );
      }

      )
    )
  }

  private findIssueByParent(issue: Issue): Observable<Issue[]> {
    return from(this.issueRepository.query(`select * from issue where "parentIssueId" = ${issue.id} and status != '1'`))
  }
  private findUserById(id: number): Observable<User> {
    return from(this.userRepository.findOneBy({ id }));
  }

  private findLabelsByIds(ids: number[]): Observable<Label[]> {
    return from(
      this.labelRepository.findBy({
        id: Any(ids),
      }),
    );
  }
  private findAllIssuesBySectionId(ids: number[]): Observable<Project[]> {
    return from(
      this.projectRepository.find({
        where: { id: Any(ids)  },
        relations: ['issue'],
      }),
    );
  }

  private findSectionsIdsProjectId(id: number): Observable<number[]> {
    return from(
      this.issueRepository.query(`select * from  project
    where project."parentProjectId" = ${id}`),
    ).pipe(
      map((sections: Project[]) => {
        const ids: number[] = [];
        for (const key in sections) {
          ids.push(sections[key].id);
        }
        
        return ids;
      }),
    );
  }
  private findByProjectId(id: number): Observable<Project> {
    return from(
      this.projectRepository.findOne({
        where: { id },
        relations: ['parentProject'],
      }),
    );
  }


}
