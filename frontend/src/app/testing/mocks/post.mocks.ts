// faker
import { faker } from "@faker-js/faker";
// model
import { Post, PostWithExcerpt } from "../../models/post.model";
import { AuthorMock } from "./user.mocks";

export const PostMock = (): Post => {
  return {
    id: faker.number.int(),
    author: AuthorMock(),
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraph(),
    public_permission: 'read-and-edit',
    authenticated_permission: 'read-and-edit',
    team_permission: 'read-and-edit',
    author_permission: 'read-and-edit',
    created_at: faker.date.recent().toDateString(),
  };
}

export const PostWithExcerptMock = (): PostWithExcerpt => {
  return {
    id: faker.number.int(),
    author: AuthorMock(),
    title: faker.lorem.sentence(),
    content_excerpt: faker.lorem.paragraph(),
    public_permission: 'read-and-edit',
    authenticated_permission: 'read-and-edit',
    team_permission: 'read-and-edit',
    author_permission: 'read-and-edit',
    created_at: faker.date.recent().toDateString(),
  };
}
