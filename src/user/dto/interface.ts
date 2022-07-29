import { UserRole } from "../entities/user-role";

export interface UserResponse {
    id?: number;
    username?: string;
    email?: string;
    role?: UserRole;
    password?:string;
    isBlocked?:boolean | true;
    photoUrl?:string | null;
  }
  