// models
import { Author } from "./user.model";

export interface Comment {
  id: number,
  user: Author,
  post: number
  content: string,
  created_at: string,
}
