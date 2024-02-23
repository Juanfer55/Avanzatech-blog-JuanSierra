import { Author } from './user.model';

export interface Post {
  id: number;
  title: string;
  author: Author;
  content: string;
  public_permission: number;
  authenticated_permission: number;
  team_permission: number;
  author_permission: number;
  created_at: string;
}

export interface PostWithExcerpt extends Omit<Post, 'content'> {
  content_excerpt: string;
}

export interface PostWithoutPermission
  extends Omit<
    Post,
    | 'public_permission'
    | 'authenticated_permission'
    | 'team_permission'
    | 'author_permission'
  > {}
