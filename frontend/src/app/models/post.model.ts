import { Author } from "./user.model";

export interface Post {
  id: number;
  title: string;
  author: Author;
  content: string;
  public_permission: string;
  authenticated_permission: string;
  team_permission: string;
  author_permission: number;
  created_at: string;
}


export interface PostWithExcerpt extends Omit<Post, 'content'> {
  content_excerpt: string;
}
