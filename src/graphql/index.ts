import { Resolvers } from '../generated/graphql';
import { answerMutation } from './Answer/resolve';
import { companyMutation, companyQuery } from './Company/resolve';
import { questionMutation, questionTemplateMutation } from './Question/resolve';
import {
  questionnaireMutation,
  questionnaireQuery,
} from './Questionnaire/resolve';
import {
  questionnaireConfigurationMutation,
  questionnaireConfigurationQuery,
} from './QuestionnaireConfiguration/resolve';
import { userMutation, userQuery } from './User/resolve';

const resolvers: Resolvers = {
  Query: {
    __typename: 'Query',
    ...userQuery,
    ...companyQuery,
    ...questionnaireQuery,
    ...questionnaireConfigurationQuery,
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
