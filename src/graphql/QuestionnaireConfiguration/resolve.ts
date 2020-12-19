import { AdminRole, Mutation, Query } from '../../generated/graphql';
import { QuestionnaireConfigurationModel } from '../../services/models';
import { Forbidden, NotAuthenticatedError } from '../../utils/errors';
import { filterInputSchema, ValidatedFilterInput } from '../../utils/validate';
import { mapQuestionnaireConfiguration } from './map';
import { createQuestionnaireConfigurationSchema } from './validate';

const questionnaireConfigurations: Query['questionnaireConfigurations'] = async (
  _,
  args,
  context,
) => {
  const {
    skip,
    limit,
  }: ValidatedFilterInput = await filterInputSchema.validateAsync(args.input);

  if (!context.user) {
    throw new NotAuthenticatedError();
  }

  const questionnaireConfigurationDocs = await QuestionnaireConfigurationModel.find(
    { company: context.user.company.id },
  )
    .skip(skip)
    .limit(limit);

  return questionnaireConfigurationDocs.map(mapQuestionnaireConfiguration);
};

export const questionnaireConfigurationQuery = {
  questionnaireConfigurations,
};

const createQuestionnaireConfiguration: Mutation['createQuestionnaireConfiguration'] = async (
  _,
  args,
  context,
) => {
  await createQuestionnaireConfigurationSchema.validateAsync(args.input);

  if (!context.user) {
    throw new NotAuthenticatedError();
  }

  if (context.user.role !== AdminRole.admin) {
    throw new Forbidden();
  }

  const questionnaireConfiguration = await QuestionnaireConfigurationModel.create(
    {
      name: args.input.name,
      type: args.input.type,
      company: context.user.company.id,
      user: context.user.id,
      questionTemplates: [],
    },
  );

  return mapQuestionnaireConfiguration(questionnaireConfiguration);
};

export const questionnaireConfigurationMutation = {
  createQuestionnaireConfiguration,
};
