import { Team } from "./team.model";

export interface User {
  id: number;
  username: string;
  password: string;
  team: Team
  is_admin: boolean;
}

export interface UserProfile extends Omit<User, 'password'> {}

export interface Author extends Omit<User, 'password' | 'is_admin'> {}
