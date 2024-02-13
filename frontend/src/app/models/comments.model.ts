// models
import { Author } from "./user.model";

export interface Comment {
  user: Author,
  post: Number
}
