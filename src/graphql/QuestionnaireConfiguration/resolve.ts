import { AdminRole, Mutation } from '../../generated/graphql';
import { QuestionnaireConfigurationModel } from '../../services/models';
import { Forbidden, NotAuthenticatedError } from '../../utils/errors';
import { mapQuestionnaireConfiguration } from './map';
import { createQuestionnaireConfigurationSchema } from './validate';

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
