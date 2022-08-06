import { User } from "src/user/entities/user.entity";
import { ModelType } from "../entities/model-type";

export interface FavouriteResponse{
    id?:number,
    user?:User,
    modelId?: number,
    modelType?:ModelType
}