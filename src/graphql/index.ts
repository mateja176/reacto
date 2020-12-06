import { Resolvers } from '../generated/resolvers';
import { Context } from '../interfaces/Context';
import company from './company/company';
import user from './user/user';

const resolvers: Resolvers<Context> = {
  Query: {
    company,
    user,
  },
};

export default resolvers;
