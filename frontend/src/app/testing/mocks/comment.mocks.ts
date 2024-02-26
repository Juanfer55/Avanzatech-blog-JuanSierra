import { faker } from '@faker-js/faker';
import { Comment } from '../../models/comments.model';
import { AuthorMock } from './user.mocks';

export const CommentMock = (): Comment => {
  return {
    id: faker.number.int(),
    post: faker.number.int(),
    user: AuthorMock(),
    content: faker.lorem.sentence(),
    created_at: faker.date.recent().toDateString(),
  };
}

export const CommentListMock = (n: number): Comment[] => {
  const comments: Comment[] = [];
  for (let i = 0; i < n; i++) {
    comments.push(CommentMock());
  }
  return comments;
};
