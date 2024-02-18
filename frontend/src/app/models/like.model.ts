// models
import { Author } from "./user.model";

export interface Like {
  id: number
  user: Author
  post: number
}
