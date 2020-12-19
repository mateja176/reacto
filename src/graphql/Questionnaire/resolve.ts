import { Mutation } from '../../generated/graphql';
import { QuestionnaireModel } from '../../services/models';
import { NotAuthenticatedError } from '../../utils/errors';
import { mapQuestionnaire } from './map';
import { createQuestionnaireInputSchema } from './validate';

const createQuestionnaire: Mutation['createQuestionnaire'] = async (
  _,
  args,
  context,
) => {
  await createQuestionnaireInputSchema.validateAsync(args.input);

  if (!context.user) {
    throw new NotAuthenticatedError();
  }

  const questionnaireDoc = await QuestionnaireModel.create({
    name: args.input.name,
    company: context.user.company.id,
    user: context.user.id,
    inheritedQuestions: [],
    questions: [],
  });

  return mapQuestionnaire(questionnaireDoc);
};

export const questionnaireMutation = {
  createQuestionnaire,
};
