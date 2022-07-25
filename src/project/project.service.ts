import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { join } from 'path';
import { Color } from 'src/color/entities/color.entity';
import { Team } from 'src/team/entities/team.entity';
import { User } from 'src/user/entities/user.entity';
import { createQueryBuilder, getManager, getRepository, Repository, Timestamp } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectService {

  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,

    @InjectRepository(User)    
    private userRepository:Repository<User>,
    
    @InjectRepository(Color)    
    private colorRepository:Repository<Color>,
    
    @InjectRepository(Team)    
    private teamRepository:Repository<Team>
  
  ) { }

  async create(createProjectDto: CreateProjectDto) {
     const user1 = await this.userRepository.findOne({
      where:{
        id: createProjectDto.userId
      }
    })
   
   const color = await this.colorRepository.findOne({where:{
   id: createProjectDto.colorId}});

      const pr = await this.projectRepository.create({
      name: createProjectDto.name,
      createdAt: new Date(),
     })

if(user1 != null && color != null){  
   pr.user = user1;
   pr.color = color;
}
    if(createProjectDto.parentProjectId != null){
     const pproject = await this.projectRepository.findOne({where:{
      id: createProjectDto.parentProjectId}});
      if(pproject.parentProject == null){
      pr.parentProject = pproject
      }
    } else{
      pr.parentProject = null;
    }

    this.projectRepository.save(pr);
    return pr;
  }

  async findAllByUserId(id1: number) {
    const user1 = await this.userRepository.findOne({
      where:{
        id: id1
      }
    })
  
 
 if(user1 != null){

   const teamProjects = await this.teamRepository
   .query(`select p.* from team
   join team_user_users tuu on team.id = tuu."teamId"
   join team_project_project tpp on team.id = tpp."teamId"
   join project p on p.id = tpp."projectId"
where tuu."usersId" = ${user1.id}`)

 const projects = await this.projectRepository
.query(`select * from project
left join  team_project_project tpp on project.id = tpp."projectId"
where project."userId" =  ${user1.id} and tpp."projectId" is null`)
 return {
   teamProjects: teamProjects,
  userprojects: projects
 }
 }
     return "This user doesn't exist";
  }

  findOne(id: number) {
    return `This action returns a #${id} project`;
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return `This action updates a #${id} project`;
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }
}
