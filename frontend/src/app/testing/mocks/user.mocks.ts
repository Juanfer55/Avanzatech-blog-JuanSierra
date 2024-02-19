import { faker } from '@faker-js/faker';
import { TeamMock } from './team.mocks';
import { Author, UserProfile } from '../../models/user.model';

export const UserProfileMock = (): UserProfile => {
  return {
    id: faker.number.int(),
    username: faker.internet.email(),
    team: TeamMock(),
    is_admin: faker.datatype.boolean(),
  };
}

export const AuthorMock = (): Author => {
  return {
    id: faker.number.int(),
    username: faker.internet.email(),
    team: TeamMock(),
  };
}
