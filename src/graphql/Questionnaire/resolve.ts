import { mongoose } from '@typegoose/typegoose';
import { Mutation, Query } from '../../generated/graphql';
import {
  NotAuthenticatedError,
  QuestionnaireConfigurationNotFound,
} from '../../utils/errors';
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

  const questionnaireDocs = await context.models.Questionnaire.find({
    company: context.user.company.id,
  })
    .skip(skip)
    .limit(limit);

  return questionnaireDocs.map(mapQuestionnaire(context.models));
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

  const questionnaireConfigurationDoc = await context.models.QuestionnaireConfiguration.findById(
    args.input.questionnaireConfigurationId,
  );

  if (!questionnaireConfigurationDoc) {
    throw new QuestionnaireConfigurationNotFound();
  }

  const questionTemplateDocs = await context.models.QuestionTemplate.find({
    _id: { $in: questionnaireConfigurationDoc.questionTemplates },
  });

  const session = await mongoose.startSession();
  session.startTransaction();

  const questionnaireId = mongoose.Types.ObjectId();

  const inheritedQuestionDocs = await context.models.Question.create(
    questionTemplateDocs.map(questionTemplateToQuestion(questionnaireId)),
  );

  const questionnaireDoc = await context.models.Questionnaire.create({
    _id: questionnaireId,
    name: args.input.name,
    type: questionnaireConfigurationDoc.type,
    company: context.user.company.id,
    user: context.user.id,
    inheritedQuestions: inheritedQuestionDocs.map(({ _id }) => _id),
    questions: [],
  });

  await context.models.Company.updateOne(
    { _id: context.user.company.id },
    { $push: { questionnaires: questionnaireDoc._id } },
  );
  await context.models.User.updateOne(
    { _id: context.user.id },
    { $push: { questionnaires: questionnaireDoc._id } },
  );

  await session.commitTransaction();
  session.endSession();

  return mapQuestionnaire(context.models)(questionnaireDoc);
};

export const questionnaireMutation = {
  createQuestionnaire,
};
