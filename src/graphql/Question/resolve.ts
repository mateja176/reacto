import { DocumentType, mongoose } from '@typegoose/typegoose';
import { isNil } from 'ramda';
import { QuestionClass } from '../../classes/Question/Question';
import { QuestionnaireClass } from '../../classes/Questionnaire/Questionnaire';
import { Context } from '../../Context';
import { AdminRole, Mutation, Query } from '../../generated/graphql';
import {
  Forbidden,
  NotAuthenticatedError,
  NotFoundError,
  QuestionnaireConfigurationNotFound,
} from '../../utils/errors';
import {
  filterInputSchema,
  idSchema,
  ValidatedFilterInput,
} from '../../utils/validate';
import {
  BooleanQuestionConfig,
  BooleanQuestionTemplateConfig,
  BooleanUpdateQuestionConfig,
  CreateQuestionDocConfig,
  CreateQuestionTemplateDocConfig,
  FileQuestionConfig,
  FileQuestionTemplateConfig,
  FilesQuestionConfig,
  FilesQuestionTemplateConfig,
  FilesUpdateQuestionConfig,
  FileUpdateQuestionConfig,
  MultiNumbersQuestionConfig,
  MultiNumbersQuestionTemplateConfig,
  MultiNumbersUpdateQuestionConfig,
  MultiStringsQuestionConfig,
  MultiStringsQuestionTemplateConfig,
  MultiStringsUpdateQuestionConfig,
  NumberQuestionConfig,
  NumberQuestionTemplateConfig,
  NumbersQuestionConfig,
  NumbersQuestionTemplateConfig,
  NumbersUpdateQuestionConfig,
  NumberUpdateQuestionConfig,
  QuestionConfig,
  QuestionTemplateConfig,
  StringQuestionConfig,
  StringQuestionTemplateConfig,
  StringsQuestionConfig,
  StringsQuestionTemplateConfig,
  StringsUpdateQuestionConfig,
  StringUpdateQuestionConfig,
  UpdateQuestionConfig,
} from './interfaces';
import {
  createQuestionDoc,
  createQuestionTemplateDoc,
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
  mapQuestionTemplate,
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
} from './validate';

const questionTemplates: Query['questionTemplates'] = async (
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

  const questionTemplateDocs = await context.models.QuestionTemplate.find({
    company: context.user.company.id,
  })
    .skip(skip)
    .limit(limit);

  return questionTemplateDocs.map(mapQuestionTemplate(context.models));
};

export const questionTemplateQuery = {
  questionTemplates,
};

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
    createQuestionTemplateDoc({
      type,
      input: args.input,
    } as CreateQuestionTemplateDocConfig),
  );

  const questionnaireConfiguration = await context.models.QuestionnaireConfiguration.findOneAndUpdate(
    { _id: args.input.questionnaireConfigurationId },
    { $push: { questionTemplates: doc._id } },
  );

  if (!questionnaireConfiguration) {
    throw new QuestionnaireConfigurationNotFound();
  }

  await session.commitTransaction();
  session.endSession();

  const output = map(context.models)(doc);

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

  if (context.user.role !== AdminRole.admin) {
    throw new Forbidden();
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  const doc = await context.models.Question.create(
    createQuestionDoc({ type, input: args.input } as CreateQuestionDocConfig),
  );

  const questionnaire = await context.models.Questionnaire.findOneAndUpdate(
    { _id: args.input.questionnaireId },
    { $push: { questions: doc._id } },
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

  const {
    input: { id, ...questionBase },
  } = args;

  if (!context.user) {
    throw new NotAuthenticatedError();
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  const doc = (await context.models.Question.findOneAndUpdate(
    { _id: id },
    Object.fromEntries<string, typeof questionBase[keyof typeof questionBase]>(
      Object.entries(questionBase).filter(
        (entry): entry is [typeof entry[0], NonNullable<typeof entry[1]>] =>
          !isNil(entry[1]),
      ),
    ),
  ).populate('questionnaire')) as DocumentType<
    Omit<QuestionClass, 'questionnaire'> & { questionnaire: QuestionnaireClass }
  >;

  if (!doc) {
    throw new NotFoundError();
  }

  if (
    !(
      (context.user.role === AdminRole.admin &&
        String(doc.questionnaire.company) === context.user.company.id) ||
      String(doc.questionnaire.user) === context.user.id
    )
  ) {
    throw new Forbidden();
  }

  await session.commitTransaction();
  session.endSession();

  const output = map(context.models)(doc);

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
  )) as DocumentType<
    Omit<QuestionClass, 'questionnaire'> & { questionnaire: QuestionnaireClass }
  >;

  if (!questionDoc) {
    throw new NotFoundError();
  }

  if (
    !(
      context.user.role === AdminRole.admin ||
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
