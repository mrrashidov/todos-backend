import { Color } from 'src/color/entities/color.entity';
import { User } from 'src/user/entities/user.entity';

export interface LabelResponse{
  id?: number;
  name?:string;
  user?:User
  color?:Color
}
