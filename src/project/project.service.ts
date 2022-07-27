import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Color } from 'src/color/entities/color.entity';
import { Team } from 'src/team/entities/team.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
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
    private teamRepository: Repository<Team>
  
  ) { }

  async create(createProjectDto: CreateProjectDto) {
  
    const [user,color,project] = await Promise.all([
      this.userRepository.findOne({ where:{ id: createProjectDto.userId }}),
      this.colorRepository.findOne({where:{  id: createProjectDto.colorId}}),
      this.projectRepository.create({ name: createProjectDto.name, createdAt: new Date() })   ])

    if(user != null && color != null){  
      project.user = user;
      project.color = color;
}
    if(createProjectDto.parentProjectId != null){
      const parentProject = await this.projectRepository.findOne({where:{ id: createProjectDto.parentProjectId}});
     
     if(parentProject.parentProject == null){
        project.parentProject = parentProject
      }
    } else{
      project.parentProject = null;
    }
    this.projectRepository.save(project);
   
    return project;
  }



  async findAllByUserId(userId: number) {

    const user = await this.userRepository.findOneBy({ id: userId  })

    if(user != null){
    const [teamProjects,projects] = await Promise.all([
    this.teamRepository.query(`select p.* from team join team_user_users tuu on team.id = tuu."teamId" join project p on p.id = team."projectId" where tuu."usersId" = ${user.id} `),
    this.projectRepository.query(`select * from project  left join  team  tpp on project.id = tpp."projectId"  where project."userId" = ${user.id}  and tpp."projectId" is null and project."parentProjectId" is null and project."isDelete" = false`) ])

    return {
   teamProjects: teamProjects,
   userprojects: projects
 }
 }
     return "This user doesn't exist";
  }






  async update(projectId: number, updateProjectDto: UpdateProjectDto) {
   
     const [project, color ] = await Promise.all([
      this.projectRepository.findOneBy({ id: projectId  }),
      this.colorRepository.findOne({where:{ id: updateProjectDto.colorId }}) ])

     project.color = color;
     project.name = updateProjectDto.name
     
    await this.projectRepository.save(project)
      return project;
  }



  async remove(projectId: number, userId: number) {

       const [project, team] = await Promise.all([
        this.projectRepository.findOne({where: { id: projectId }, relations: ['user'] }),
        this.teamRepository.findOne({ where:{ project:{ id: projectId }}, relations: ['user']}) ])
        console.log(project,team)

      if(project.user.id == userId && team == null){
      project.isDelete = true
      await this.projectRepository.save(project)
    } 
  else  if(team != null && project.user.id == userId){
      project.isDelete = true
     await Promise.all([
      this.projectRepository.save(project),
      this.teamRepository.remove(team)])
      console.log(project,team)

    }
     else {
      const user =  team.user.find((obj) => {
        return obj.id == userId;
      });
      console.log(user)
  if(user != null){
      team.user.forEach((element,index)=>{
        if(element.id==user.id) delete team.user[index];
     }); 
     this.teamRepository.save(team)
    }
      
    }

  
    return "DELETED";
  }
}
