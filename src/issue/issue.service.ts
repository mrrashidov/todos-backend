import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map, Observable, switchMap } from 'rxjs';
import { Color } from 'src/color/entities/color.entity';
import { IssueStatus } from 'src/enum/IssueStatus';
import { Label } from 'src/label/entities/label.entity';
import { Project } from 'src/project/entities/project.entity';
import { User } from 'src/user/entities/user.entity';
import { Any, Repository } from 'typeorm';
import { CreateIssueDto } from './dto/create-issue.dto';
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
      status: IssueStatus.ACTIVE
    })
    if (createIssueDto.description != null) {
          issue.description = createIssueDto.description
        }
    
    return this.findByColorId(createIssueDto.colorId).pipe(
      switchMap((color: Color) => {
        if (color != null) {
          issue.colors = color
          if (createIssueDto.labels != null) {
            return this.findLabelsByIds(createIssueDto.labels).pipe(
              switchMap((labels: Label[]) => {
                issue.labels = labels
                return this.findUserById(createIssueDto.userId).pipe(
                  switchMap((user: User) => {
                    issue.user = user
                    if (createIssueDto.parentIssueId != null && createIssueDto.parentIssueId != null) {
                       throw new HttpException('One of parent or project id must be null', HttpStatus.BAD_REQUEST);
                    }
                    else if (createIssueDto.parentIssueId != null) {
                      return this.findByIssueId(createIssueDto.parentIssueId).pipe(
                        switchMap((prIssue: Issue) => {
                          if (prIssue != null && prIssue.parentIssue == null) {
                            issue.parentIssue = prIssue
                            return from(this.issueRepository.save(issue)).pipe(
                              map((createdIssue: Issue) => {
                                return createdIssue;
                              })
                            )}
                        })
                      )
                    } else if (createIssueDto.projectId != null) {
                      return this.findByProjectId(createIssueDto.projectId).pipe(
                        switchMap((project: Project) => {
                          issue.project = project
                          return from(this.issueRepository.save(issue)).pipe(
                            map((createdIssue: Issue) => {
                              return createdIssue;
                            }
                            ))
                        }))
                    }
                  }) )
              })
      )}
        } })
    ) }



  private findUserById(id: number): Observable<User> {
    return from(this.userRepository.findOneBy({ id }))
  }

  private findLabelsByIds(ids: number[]): Observable<Label[]> {
    return from(this.labelRepository.findBy({
      id: Any(ids)
    }))
  }

  private findByProjectId(id: number): Observable<Project> {
    return from(this.projectRepository.findOneBy({ id }))
  }

  private findByIssueId(id: number): Observable<Issue> {
    return from(this.issueRepository.findOne({ where: { id }, relations: ['parentIssue'] }));

  }

  private findByColorId(id: number): Observable<Color> {
    return from(this.colorRepository.findOneBy({ id }));
  }

  
  
  findAll() {
    return `This action returns all issue`;
  }

  findOne(id: number) {
    return `This action returns a #${id} issue`;
  }

  update(id: number, updateIssueDto: UpdateIssueDto) {
    return `This action updates a #${id} issue`;
  }

  remove(id: number) {
    return `This action removes a #${id} issue`;
  }
}
function relations(arg0: { id: number; }, relations: any, arg2: string[]): Promise<Issue> {
  throw new Error('Function not implemented.');
}

