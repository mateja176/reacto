import { Resolvers } from '../generated/graphql';
import { companyMutation, companyQuery } from './Company/resolve';
import { questionMutation, questionTemplateMutation } from './Question/resolve';
import { questionnaireMutation } from './Questionnaire/resolve';
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
    ...questionTemplateMutation,
    ...questionnaireMutation,
    ...questionMutation,
  },
};

export default resolvers;
