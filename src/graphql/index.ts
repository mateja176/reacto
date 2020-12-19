import { Resolvers } from '../generated/graphql';
import { answerMutation } from './Answer/resolve';
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
    ...answerMutation,
  },
};

export default resolvers;
