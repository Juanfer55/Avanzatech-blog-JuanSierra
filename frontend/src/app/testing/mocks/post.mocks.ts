// faker
import { faker } from "@faker-js/faker";
// model
import { Post, PostWithExcerpt, PostWithoutPermission } from "../../models/post.model";
import { AuthorMock } from "./user.mocks";

export const PostMock = (): Post => {
  return {
    id: faker.number.int(),
    author: AuthorMock(),
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraph(),
    public_permission: 3,
    authenticated_permission: 3,
    team_permission: 3,
    author_permission: 3,
    created_at: faker.date.recent().toDateString(),
  };
}

export const PostWithExcerptMock = (): PostWithExcerpt => {
  return {
    id: faker.number.int(),
    author: AuthorMock(),
    title: faker.lorem.sentence(),
    content_excerpt: faker.lorem.paragraph(),
    public_permission: 3,
    authenticated_permission: 3,
    team_permission: 3,
    author_permission: 3,
    created_at: faker.date.recent().toDateString(),
  };
}

export const PostWithoutPermissionMock = (): PostWithoutPermission => {
  return {
    id: faker.number.int(),
    author: AuthorMock(),
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraph(),
    created_at: faker.date.recent().toDateString(),
  }
}
