import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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


  async create(createIssueDto: CreateIssueDto) {

    const issue = await this.issueRepository.create({
      title: createIssueDto.title,
      dueDate: createIssueDto.dueDate,
      createdAt: new Date(),
    })
    if (createIssueDto.parentIssueId != null && createIssueDto.projectId != null) {
      return "If this issue subIssue then project id must be null"
    }
    if (createIssueDto.description != null) {
      issue.description = createIssueDto.description
    }

    if (createIssueDto.parentIssueId != null) {
      const parentIssue = await this.issueRepository.findOne({
        where: { id: createIssueDto.parentIssueId }, relations: ['parentIssue'],
      })

      if (parentIssue.parentIssue == null) {
        issue.parentIssue = parentIssue
      }
    }
    if (createIssueDto.projectId != null) {
      const project = await this.projectRepository.findOne({ where: { id: createIssueDto.projectId } })
      issue.project = project
    }

    if (createIssueDto.labels != null) {
      const labels = await this.labelRepository.findBy({
        id: Any(createIssueDto.labels)
      })
      if (labels != null) {
        issue.labels = labels
      }
    }

    const [user, color] = await Promise.all([
      this.userRepository.findOne({ where: { id: createIssueDto.userId } }),
      this.colorRepository.findOne({ where: { id: createIssueDto.colorId } })  ])

    issue.colors = color
    issue.user = user
    issue.priority = createIssueDto.priority
    issue.status = IssueStatus.ACTIVE

    this.issueRepository.save(issue)
    return issue;
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
