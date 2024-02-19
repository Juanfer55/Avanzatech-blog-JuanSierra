import { faker } from "@faker-js/faker";
import { Like } from "../../models/like.model";
import { AuthorMock } from "./user.mocks";

export const LikeMock = (): Like => {
  return {
    id: faker.number.int(),
    user: AuthorMock(),
    post: faker.number.int(),
  };
}
