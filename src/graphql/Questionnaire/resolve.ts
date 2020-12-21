import { ApolloError } from 'apollo-server-express';
import mongoose from 'mongoose';
import { Mutation, Query } from '../../generated/graphql';
import {
  CompanyModel,
  QuestionModel,
  QuestionnaireConfigurationModel,
  QuestionnaireModel,
  QuestionTemplateModel,
  UserModel,
} from '../../services/models';
import { NotAuthenticatedError } from '../../utils/errors';
import { filterInputSchema, ValidatedFilterInput } from '../../utils/validate';
import { mapQuestionnaire, questionTemplateToQuestion } from './map';
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

  const questionnaireConfigurationDoc = await QuestionnaireConfigurationModel.findById(
    args.input.questionnaireConfigurationId,
  );

  if (!questionnaireConfigurationDoc) {
    throw new ApolloError('Questionnaire configuration not found.');
  }

  const questionTemplateDocs = await QuestionTemplateModel.find({
    _id: { $in: questionnaireConfigurationDoc.questionTemplates },
  });

  const session = await mongoose.startSession();
  session.startTransaction();

  const questionnaireId = mongoose.Types.ObjectId();

  const inheritedQuestionDocs = await QuestionModel.create(
    questionTemplateDocs.map(questionTemplateToQuestion(questionnaireId)),
  );

  const questionnaireDoc = await QuestionnaireModel.create({
    _id: questionnaireId,
    name: args.input.name,
    type: questionnaireConfigurationDoc.type,
    company: context.user.company.id,
    user: context.user.id,
    inheritedQuestions: inheritedQuestionDocs.map(({ _id }) => _id),
    questions: [],
  });

  await CompanyModel.updateOne(
    { _id: context.user.company.id },
    { $push: { questionnaires: questionnaireDoc._id } },
  );
  await UserModel.updateOne(
    { _id: context.user.id },
    { $push: { questionnaires: questionnaireDoc._id } },
  );

  await session.commitTransaction();
  session.endSession();

  return mapQuestionnaire(questionnaireDoc);
};

export const questionnaireMutation = {
  createQuestionnaire,
};
