import { Resolvers } from '../generated/graphql';
import { companyMutation, companyQuery } from './Company/resolve';
import { userMutation, userQuery } from './User/resolve';

const resolvers: Resolvers = {
  Query: {
    ...userQuery,
    ...companyQuery,
  },
  Mutation: {
    ...userMutation,
    ...companyMutation,
  },
};

export default resolvers;
