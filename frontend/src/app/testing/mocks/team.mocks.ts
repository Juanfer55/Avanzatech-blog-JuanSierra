import { faker } from '@faker-js/faker';
import { Team } from '../../models/team.model';

export const TeamMock = (): Team => {
  return {
    id: faker.number.int(),
    name: faker.word.sample(),
  };
}
