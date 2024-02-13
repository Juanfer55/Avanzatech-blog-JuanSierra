// models
import { Author } from "./user.model";

export interface Like {
  id: Number
  user: Author
  post: number
}
