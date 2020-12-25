import { mongoose } from '@typegoose/typegoose';
import { AdminRole, Mutation, Query } from '../../generated/graphql';
import {
  Forbidden,
  NotAuthenticatedError,
  NotFoundError,
} from '../../utils/errors';
import { filterInputSchema, ValidatedFilterInput } from '../../utils/validate';
import { mapQuestionnaireConfiguration } from './map';
import {
  createQuestionnaireConfigurationSchema,
  updateQuestionnaireConfigurationSchema,
} from './validate';

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

  const questionnaireConfigurationDocs = await context.models.QuestionnaireConfiguration.find(
    { company: context.user.company.id },
  )
    .skip(skip)
    .limit(limit);

  return questionnaireConfigurationDocs.map(
    mapQuestionnaireConfiguration(context.models),
  );
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

  const session = await mongoose.startSession();
  session.startTransaction();

  const questionnaireConfigurationDoc = await context.models.QuestionnaireConfiguration.create(
    {
      name: args.input.name,
      type: args.input.type,
      company: context.user.company.id,
      user: context.user.id,
      questionTemplates: [],
    },
  );

  await context.models.Company.updateOne(
    { _id: context.user.company.id },
    {
      $push: { questionnaireConfigurations: questionnaireConfigurationDoc._id },
    },
  );
  await context.models.User.updateOne(
    { _id: context.user.id },
    {
      $push: { questionnaireConfigurations: questionnaireConfigurationDoc._id },
    },
  );

  await session.commitTransaction();
  session.endSession();

  return mapQuestionnaireConfiguration(context.models)(
    questionnaireConfigurationDoc,
  );
};

const updateQuestionnaireConfiguration: Mutation['updateQuestionnaireConfiguration'] = async (
  _,
  args,
  context,
) => {
  await updateQuestionnaireConfigurationSchema.validateAsync(args.input);

  if (!context.user) {
    throw new NotAuthenticatedError();
  }

  if (context.user.role === AdminRole.admin) {
    throw new Forbidden();
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  const questionnaireConfigurationDoc = await context.models.QuestionnaireConfiguration.findByIdAndUpdate(
    { _id: args.input.id },
    {
      name: args.input.name,
      type: args.input.type,
    },
  );

  if (!questionnaireConfigurationDoc) {
    throw new NotFoundError();
  }

  await session.commitTransaction();
  session.endSession();

  return mapQuestionnaireConfiguration(context.models)(
    questionnaireConfigurationDoc,
  );
};

export const questionnaireConfigurationMutation = {
  createQuestionnaireConfiguration,
  updateQuestionnaireConfiguration,
};
