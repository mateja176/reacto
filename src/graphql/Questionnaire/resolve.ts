import { Mutation, Query } from '../../generated/graphql';
import { QuestionnaireModel } from '../../services/models';
import { NotAuthenticatedError } from '../../utils/errors';
import { filterInputSchema, ValidatedFilterInput } from '../../utils/validate';
import { mapQuestionnaire } from './map';
import { createQuestionnaireInputSchema } from './validate';

const questionnaires: Query['questionnaires'] = async (_, args, context) => {
  const {
    skip,
    limit,
  }: ValidatedFilterInput = await filterInputSchema.validateAsync(args.input);

  if (!context.user) {
    throw new NotAuthenticatedError();
  }

  const questionnaireDocs = await QuestionnaireModel.find({
    company: context.user.company.id,
  })
    .skip(skip)
    .limit(limit);

  return questionnaireDocs.map(mapQuestionnaire);
};

export const questionnaireQuery = {
  questionnaires,
};

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
