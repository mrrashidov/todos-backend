import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Color } from 'src/color/entities/color.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository, Timestamp } from 'typeorm';
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
    private colorRepository:Repository<Color>
  
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

  findAll() {
    return `This action returns all project`;
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
