import { Resolvers } from '../generated/graphql';
import { companyMutation, companyQuery } from './Company/resolve';
import { questionnaireConfigurationMutation } from './QuestionnaireConfiguration/resolve';
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
    ...questionnaireConfigurationMutation,
  },
};

export default resolvers;
