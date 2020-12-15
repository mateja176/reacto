import { Resolvers } from '../generated/graphql';
import { companyMutation, companyQuery } from './Company/resolve';
import { userMutation, userQuery } from './User/resolve';

const resolvers: Resolvers = {
  Query: {
    __typename: 'Query',
    ...userQuery,
    ...companyQuery,
  },
  Mutation: {
    __typename: 'Mutation',
    ...userMutation,
    ...companyMutation,
  },
};

export default resolvers;
