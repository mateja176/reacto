import { DocumentType, mongoose } from '@typegoose/typegoose';
import { QuestionClass } from '../../classes/Question/Question';
import { QuestionTemplateClass } from '../../classes/Question/QuestionTemplate';
import { QuestionnaireClass } from '../../classes/Questionnaire/Questionnaire';
import { QuestionnaireConfigurationClass } from '../../classes/QuestionnaireConfiguration/QuestionnaireConfiguration';
import { Context } from '../../Context';
import { AdminRole, Mutation } from '../../generated/graphql';
import {
  Forbidden,
  NotAuthenticatedError,
  NotFoundError,
  QuestionnaireConfigurationNotFound,
} from '../../utils/errors';
import { WithId } from '../../utils/map';
import { idSchema } from '../../utils/validate';
import {
  BooleanQuestionConfig,
  BooleanQuestionTemplateConfig,
  BooleanUpdateQuestionConfig,
  BooleanUpdateQuestionTemplateConfig,
  CreateQuestionDocConfig,
  CreateQuestionTemplateDocConfig,
  FileQuestionConfig,
  FileQuestionTemplateConfig,
  FilesQuestionConfig,
  FilesQuestionTemplateConfig,
  FilesUpdateQuestionConfig,
  FilesUpdateQuestionTemplateConfig,
  FileUpdateQuestionConfig,
  FileUpdateQuestionTemplateConfig,
  MultiNumbersQuestionConfig,
  MultiNumbersQuestionTemplateConfig,
  MultiNumbersUpdateQuestionConfig,
  MultiNumbersUpdateQuestionTemplateConfig,
  MultiStringsQuestionConfig,
  MultiStringsQuestionTemplateConfig,
  MultiStringsUpdateQuestionConfig,
  MultiStringsUpdateQuestionTemplateConfig,
  NumberQuestionConfig,
  NumberQuestionTemplateConfig,
  NumbersQuestionConfig,
  NumbersQuestionTemplateConfig,
  NumbersUpdateQuestionConfig,
  NumbersUpdateQuestionTemplateConfig,
  NumberUpdateQuestionConfig,
  NumberUpdateQuestionTemplateConfig,
  QuestionConfig,
  QuestionTemplateConfig,
  StringQuestionConfig,
  StringQuestionTemplateConfig,
  StringsQuestionConfig,
  StringsQuestionTemplateConfig,
  StringsUpdateQuestionConfig,
  StringsUpdateQuestionTemplateConfig,
  StringUpdateQuestionConfig,
  StringUpdateQuestionTemplateConfig,
  UpdateQuestionConfig,
  UpdateQuestionTemplateConfig,
  UpdateQuestionTemplateDocConfig,
} from './interfaces';
import {
  createQuestionDocPayload,
  createQuestionTemplateDocPayload,
  createUpdateQuestionDocPayload,
  createUpdateQuestionTemplateDocPayload,
  mapBooleanQuestion,
  mapBooleanQuestionTemplate,
  mapFileQuestion,
  mapFileQuestionTemplate,
  mapFilesQuestion,
  mapFilesQuestionTemplate,
  mapMultiNumbersQuestion,
  mapMultiNumbersQuestionTemplate,
  mapMultiStringsQuestion,
  mapMultiStringsQuestionTemplate,
  mapNumberQuestion,
  mapNumberQuestionTemplate,
  mapNumbersQuestion,
  mapNumbersQuestionTemplate,
  mapStringQuestion,
  mapStringQuestionTemplate,
  mapStringsQuestion,
  mapStringsQuestionTemplate,
} from './map';
import {
  createBooleanQuestionSchema,
  createBooleanQuestionTemplateSchema,
  createFileQuestionSchema,
  createFileQuestionTemplateSchema,
  createFilesQuestionSchema,
  createFilesQuestionTemplateSchema,
  createMultiNumbersQuestionSchema,
  createMultiNumbersQuestionTemplateSchema,
  createMultiStringsQuestionSchema,
  createMultiStringsQuestionTemplateSchema,
  createNumberQuestionSchema,
  createNumberQuestionTemplateSchema,
  createNumbersQuestionSchema,
  createNumbersQuestionTemplateSchema,
  createStringQuestionSchema,
  createStringQuestionTemplateSchema,
  createStringsQuestionSchema,
  createStringsQuestionTemplateSchema,
  doesUpdateQuestionMatchQuestion,
  updateBooleanQuestionTemplateSchema,
  updateFileQuestionTemplateSchema,
  updateFilesQuestionTemplateSchema,
  updateMultiNumbersQuestionTemplateSchema,
  updateMultiStringsQuestionTemplateSchema,
  updateNumberQuestionTemplateSchema,
  updateNumbersQuestionTemplateSchema,
  updateStringQuestionTemplateSchema,
  updateStringsQuestionTemplateSchema,
} from './validate';

export const questionTemplateQuery = {};

export const createCreateQuestionTemplate = <
  Config extends QuestionTemplateConfig
>(
  type: Config['type'],
  schema: Config['schema'],
  map: Config['map'],
) => async (
  _: never,
  args: {
    input: Config['input'];
  },
  context: Context,
): Promise<Config['output']> => {
  await schema.validateAsync(args.input);

  if (!context.user) {
    throw new NotAuthenticatedError();
  }

  if (context.user.role !== AdminRole.admin) {
    throw new Forbidden();
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  const doc = await context.models.QuestionTemplate.create(
    createQuestionTemplateDocPayload({
      type,
      input: args.input,
    } as CreateQuestionTemplateDocConfig),
  );

  const questionnaireConfiguration = await context.models.QuestionnaireConfiguration.findOneAndUpdate(
    { _id: args.input.questionnaireConfigurationId },
    { $push: { questionTemplates: doc._id } },
    { new: true },
  );

  if (!questionnaireConfiguration) {
    throw new QuestionnaireConfigurationNotFound();
  }

  await session.commitTransaction();
  session.endSession();

  const output = map(context.models)(doc);

  return output;
};
export const createUpdateQuestionTemplate = <
  Config extends UpdateQuestionTemplateConfig
>(
  type: Config['type'],
  schema: Config['schema'],
  map: Config['map'],
) => async (
  _: never,
  args: {
    input: Config['input'];
  },
  context: Context,
): Promise<Config['output']> => {
  await schema.validateAsync(args.input);

  if (!context.user) {
    throw new NotAuthenticatedError();
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  const currentQuestionTemplateDoc = (await context.models.QuestionTemplate.findOneAndUpdate(
    { _id: args.input.id },
    createUpdateQuestionTemplateDocPayload({
      type,
      input: args.input,
    } as UpdateQuestionTemplateDocConfig),
  ).populate('questionnaireConfiguration')) as DocumentType<
    Omit<QuestionTemplateClass, 'questionnaireConfiguration'> & {
      questionnaireConfiguration: QuestionnaireConfigurationClass;
    }
  >;

  if (!currentQuestionTemplateDoc) {
    throw new NotFoundError();
  }

  if (
    !(
      context.user.role === AdminRole.admin &&
      String(currentQuestionTemplateDoc.questionnaireConfiguration.company) ===
        context.user.company.id
    )
  ) {
    throw new Forbidden();
  }

  if (!doesUpdateQuestionMatchQuestion(type, currentQuestionTemplateDoc)) {
    throw new Error(
      `The question you are attempting to update is not a "${type}" question.`,
    );
  }

  await session.commitTransaction();
  session.endSession();

  const output = map(context.models)(currentQuestionTemplateDoc);

  return output;
};

const deleteQuestionTemplate: Mutation['deleteQuestionTemplate'] = async (
  _,
  args,
  context,
) => {
  await idSchema.validateAsync(args.id);

  if (!context.user) {
    throw new NotAuthenticatedError();
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  const questionTemplateDoc = await context.models.QuestionTemplate.findByIdAndDelete(
    args.id,
  );

  if (!questionTemplateDoc) {
    throw new NotFoundError();
  }

  if (context.user.role !== AdminRole.admin) {
    throw new Forbidden();
  }

  await session.commitTransaction();
  session.endSession();

  return args.id;
};

export const questionTemplateMutation = {
  createBooleanQuestionTemplate: createCreateQuestionTemplate<BooleanQuestionTemplateConfig>(
    'boolean',
    createBooleanQuestionTemplateSchema,
    mapBooleanQuestionTemplate,
  ),
  createStringQuestionTemplate: createCreateQuestionTemplate<StringQuestionTemplateConfig>(
    'string',
    createStringQuestionTemplateSchema,
    mapStringQuestionTemplate,
  ),
  createStringsQuestionTemplate: createCreateQuestionTemplate<StringsQuestionTemplateConfig>(
    'strings',
    createStringsQuestionTemplateSchema,
    mapStringsQuestionTemplate,
  ),
  createMultiStringsQuestionTemplate: createCreateQuestionTemplate<MultiStringsQuestionTemplateConfig>(
    'multiStrings',
    createMultiStringsQuestionTemplateSchema,
    mapMultiStringsQuestionTemplate,
  ),
  createNumberQuestionTemplate: createCreateQuestionTemplate<NumberQuestionTemplateConfig>(
    'number',
    createNumberQuestionTemplateSchema,
    mapNumberQuestionTemplate,
  ),
  createNumbersQuestionTemplate: createCreateQuestionTemplate<NumbersQuestionTemplateConfig>(
    'numbers',
    createNumbersQuestionTemplateSchema,
    mapNumbersQuestionTemplate,
  ),
  createMultiNumbersQuestionTemplate: createCreateQuestionTemplate<MultiNumbersQuestionTemplateConfig>(
    'multiNumbers',
    createMultiNumbersQuestionTemplateSchema,
    mapMultiNumbersQuestionTemplate,
  ),
  createFileQuestionTemplate: createCreateQuestionTemplate<FileQuestionTemplateConfig>(
    'file',
    createFileQuestionTemplateSchema,
    mapFileQuestionTemplate,
  ),
  createFilesQuestionTemplate: createCreateQuestionTemplate<FilesQuestionTemplateConfig>(
    'files',
    createFilesQuestionTemplateSchema,
    mapFilesQuestionTemplate,
  ),
  updateBooleanQuestionTemplate: createUpdateQuestionTemplate<BooleanUpdateQuestionTemplateConfig>(
    'boolean',
    updateBooleanQuestionTemplateSchema,
    mapBooleanQuestionTemplate,
  ),
  updateStringQuestionTemplate: createUpdateQuestionTemplate<StringUpdateQuestionTemplateConfig>(
    'string',
    updateStringQuestionTemplateSchema,
    mapStringQuestionTemplate,
  ),
  updateStringsQuestionTemplate: createUpdateQuestionTemplate<StringsUpdateQuestionTemplateConfig>(
    'strings',
    updateStringsQuestionTemplateSchema,
    mapStringsQuestionTemplate,
  ),
  updateMultiStringsQuestionTemplate: createUpdateQuestionTemplate<MultiStringsUpdateQuestionTemplateConfig>(
    'multiStrings',
    updateMultiStringsQuestionTemplateSchema,
    mapMultiStringsQuestionTemplate,
  ),
  updateNumberQuestionTemplate: createUpdateQuestionTemplate<NumberUpdateQuestionTemplateConfig>(
    'number',
    updateNumberQuestionTemplateSchema,
    mapNumberQuestionTemplate,
  ),
  updateNumbersQuestionTemplate: createUpdateQuestionTemplate<NumbersUpdateQuestionTemplateConfig>(
    'numbers',
    updateNumbersQuestionTemplateSchema,
    mapNumbersQuestionTemplate,
  ),
  updateMultiNumbersQuestionTemplate: createUpdateQuestionTemplate<MultiNumbersUpdateQuestionTemplateConfig>(
    'multiNumbers',
    updateMultiNumbersQuestionTemplateSchema,
    mapMultiNumbersQuestionTemplate,
  ),
  updateFileQuestionTemplate: createUpdateQuestionTemplate<FileUpdateQuestionTemplateConfig>(
    'file',
    updateFileQuestionTemplateSchema,
    mapFileQuestionTemplate,
  ),
  updateFilesQuestionTemplate: createUpdateQuestionTemplate<FilesUpdateQuestionTemplateConfig>(
    'files',
    updateFilesQuestionTemplateSchema,
    mapFilesQuestionTemplate,
  ),
  deleteQuestionTemplate,
};

export const createCreateQuestion = <Config extends QuestionConfig>(
  type: Config['type'],
  schema: Config['schema'],
  map: Config['map'],
) => async (
  _: never,
  args: {
    input: Config['input'];
  },
  context: Context,
): Promise<Config['output']> => {
  await schema.validateAsync(args.input);

  if (!context.user) {
    throw new NotAuthenticatedError();
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  const doc = await context.models.Question.create(
    createQuestionDocPayload({
      type,
      input: args.input,
    } as CreateQuestionDocConfig),
  );

  const questionnaire = await context.models.Questionnaire.findOneAndUpdate(
    { _id: args.input.questionnaireId },
    { $push: { questions: doc._id } },
    { new: true },
  );

  if (!questionnaire) {
    throw new NotFoundError();
  }

  await session.commitTransaction();
  session.endSession();

  const output = map(context.models)(doc);

  return output;
};

export const createUpdateQuestion = <Config extends UpdateQuestionConfig>(
  type: Config['type'],
  schema: Config['schema'],
  map: Config['map'],
) => async (
  _: never,
  args: {
    input: Config['input'];
  },
  context: Context,
): Promise<Config['output']> => {
  await schema.validateAsync(args.input);

  if (!context.user) {
    throw new NotAuthenticatedError();
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  const currentQuestionDoc = (await context.models.Question.findOneAndUpdate(
    { _id: args.input.id },
    createUpdateQuestionDocPayload({
      type,
      input: args.input,
    } as UpdateQuestionConfig),
  ).populate('questionnaire')) as DocumentType<
    Omit<QuestionClass, 'questionnaire'> & { questionnaire: QuestionnaireClass }
  >;

  if (!currentQuestionDoc) {
    throw new NotFoundError();
  }

  if (
    !(
      (context.user.role === AdminRole.admin &&
        String(currentQuestionDoc.questionnaire.company) ===
          context.user.company.id) ||
      String(currentQuestionDoc.questionnaire.user) === context.user.id
    )
  ) {
    throw new Forbidden();
  }

  if (!doesUpdateQuestionMatchQuestion(type, currentQuestionDoc)) {
    throw new Error(
      `The question you are attempting to update is not a "${type}" question.`,
    );
  }

  await session.commitTransaction();
  session.endSession();

  const newQuestionDoc: WithId<QuestionClass> = {
    ...createUpdateQuestionDocPayload({
      type,
      input: args.input,
    } as UpdateQuestionConfig),
    id: String(currentQuestionDoc._id),
    questionnaire: currentQuestionDoc.questionnaire,
  };

  const output = map(context.models)(newQuestionDoc);

  return output;
};

const deleteQuestion: Mutation['deleteQuestion'] = async (_, args, context) => {
  await idSchema.validateAsync(args.id);

  if (!context.user) {
    throw new NotAuthenticatedError();
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  const questionDoc = (await context.models.Question.findByIdAndDelete(
    args.id,
  ).populate('questionnaire')) as DocumentType<
    Omit<QuestionClass, 'questionnaire'> & { questionnaire: QuestionnaireClass }
  >;

  if (!questionDoc) {
    throw new NotFoundError();
  }

  if (
    !(
      (context.user.role === AdminRole.admin &&
        String(questionDoc.questionnaire.company) ===
          context.user.company.id) ||
      context.user.id === String(questionDoc.questionnaire.user)
    )
  ) {
    throw new Forbidden();
  }

  await session.commitTransaction();
  session.endSession();

  return args.id;
};

export const questionMutation = {
  createBooleanQuestion: createCreateQuestion<BooleanQuestionConfig>(
    'boolean',
    createBooleanQuestionSchema,
    mapBooleanQuestion,
  ),
  createStringQuestion: createCreateQuestion<StringQuestionConfig>(
    'string',
    createStringQuestionSchema,
    mapStringQuestion,
  ),
  createStringsQuestion: createCreateQuestion<StringsQuestionConfig>(
    'strings',
    createStringsQuestionSchema,
    mapStringsQuestion,
  ),
  createMultiStringsQuestion: createCreateQuestion<MultiStringsQuestionConfig>(
    'multiStrings',
    createMultiStringsQuestionSchema,
    mapMultiStringsQuestion,
  ),
  createNumberQuestion: createCreateQuestion<NumberQuestionConfig>(
    'number',
    createNumberQuestionSchema,
    mapNumberQuestion,
  ),
  createNumbersQuestion: createCreateQuestion<NumbersQuestionConfig>(
    'numbers',
    createNumbersQuestionSchema,
    mapNumbersQuestion,
  ),
  createMultiNumbersQuestion: createCreateQuestion<MultiNumbersQuestionConfig>(
    'multiNumbers',
    createMultiNumbersQuestionSchema,
    mapMultiNumbersQuestion,
  ),
  createFileQuestion: createCreateQuestion<FileQuestionConfig>(
    'file',
    createFileQuestionSchema,
    mapFileQuestion,
  ),
  createFilesQuestion: createCreateQuestion<FilesQuestionConfig>(
    'files',
    createFilesQuestionSchema,
    mapFilesQuestion,
  ),
  updateBooleanQuestion: createUpdateQuestion<BooleanUpdateQuestionConfig>(
    'boolean',
    createBooleanQuestionSchema,
    mapBooleanQuestion,
  ),
  updateStringQuestion: createUpdateQuestion<StringUpdateQuestionConfig>(
    'string',
    createStringQuestionSchema,
    mapStringQuestion,
  ),
  updateStringsQuestion: createUpdateQuestion<StringsUpdateQuestionConfig>(
    'strings',
    createStringsQuestionSchema,
    mapStringsQuestion,
  ),
  updateMultiStringsQuestion: createUpdateQuestion<MultiStringsUpdateQuestionConfig>(
    'multiStrings',
    createMultiStringsQuestionSchema,
    mapMultiStringsQuestion,
  ),
  updateNumberQuestion: createUpdateQuestion<NumberUpdateQuestionConfig>(
    'number',
    createNumberQuestionSchema,
    mapNumberQuestion,
  ),
  updateNumbersQuestion: createUpdateQuestion<NumbersUpdateQuestionConfig>(
    'numbers',
    createNumbersQuestionSchema,
    mapNumbersQuestion,
  ),
  updateMultiNumbersQuestion: createUpdateQuestion<MultiNumbersUpdateQuestionConfig>(
    'multiNumbers',
    createMultiNumbersQuestionSchema,
    mapMultiNumbersQuestion,
  ),
  updateFileQuestion: createUpdateQuestion<FileUpdateQuestionConfig>(
    'file',
    createFileQuestionSchema,
    mapFileQuestion,
  ),
  updateFilesQuestion: createUpdateQuestion<FilesUpdateQuestionConfig>(
    'files',
    createFilesQuestionSchema,
    mapFilesQuestion,
  ),
  deleteQuestion,
};
