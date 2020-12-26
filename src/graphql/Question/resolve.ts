import { DocumentType, mongoose } from '@typegoose/typegoose';
import { isNil } from 'ramda';
import { QuestionClass } from '../../classes/Question/Question';
import { QuestionnaireClass } from '../../classes/Questionnaire/Questionnaire';
import { Context } from '../../Context';
import {
  AdminRole,
  BooleanQuestion,
  BooleanQuestionTemplate,
  CreateBooleanQuestionInput,
  CreateBooleanQuestionTemplateInput,
  CreateFileQuestionInput,
  CreateFileQuestionTemplateInput,
  CreateFilesQuestionInput,
  CreateFilesQuestionTemplateInput,
  CreateMultiNumbersQuestionInput,
  CreateMultiNumbersQuestionTemplateInput,
  CreateMultiStringsQuestionInput,
  CreateMultiStringsQuestionTemplateInput,
  CreateNumberQuestionInput,
  CreateNumberQuestionTemplateInput,
  CreateNumbersQuestionInput,
  CreateNumbersQuestionTemplateInput,
  CreateStringQuestionInput,
  CreateStringQuestionTemplateInput,
  CreateStringsQuestionInput,
  CreateStringsQuestionTemplateInput,
  FileQuestion,
  FileQuestionTemplate,
  FilesQuestion,
  FilesQuestionTemplate,
  MultiNumbersQuestion,
  MultiNumbersQuestionTemplate,
  MultiStringsQuestion,
  MultiStringsQuestionTemplate,
  Mutation,
  NumberQuestion,
  NumberQuestionTemplate,
  NumbersQuestion,
  NumbersQuestionTemplate,
  Query,
  StringQuestion,
  StringQuestionTemplate,
  StringsQuestion,
  StringsQuestionTemplate,
  UpdateBooleanQuestionInput,
  UpdateFileQuestionInput,
  UpdateFilesQuestionInput,
  UpdateMultiNumbersQuestionInput,
  UpdateMultiStringsQuestionInput,
  UpdateNumberQuestionInput,
  UpdateNumbersQuestionInput,
  UpdateStringQuestionInput,
  UpdateStringsQuestionInput,
} from '../../generated/graphql';
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
  updateBooleanQuestionSchema,
  updateFileQuestionSchema,
  updateFilesQuestionSchema,
  updateMultiNumbersQuestionSchema,
  updateMultiStringsQuestionSchema,
  updateNumberQuestionSchema,
  updateNumbersQuestionSchema,
  updateStringsQuestionSchema,
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

type BooleanQuestionTemplateConfig = {
  schema: typeof createBooleanQuestionTemplateSchema;
  map: typeof mapBooleanQuestionTemplate;
  input: CreateBooleanQuestionTemplateInput;
  output: BooleanQuestionTemplate;
};
type StringQuestionTemplateConfig = {
  schema: typeof createStringsQuestionTemplateSchema;
  map: typeof mapStringQuestionTemplate;
  input: CreateStringQuestionTemplateInput;
  output: StringQuestionTemplate;
};
type StringsQuestionTemplateConfig = {
  schema: typeof createStringsQuestionTemplateSchema;
  map: typeof mapStringsQuestionTemplate;
  input: CreateStringsQuestionTemplateInput;
  output: StringsQuestionTemplate;
};
type MultiStringsQuestionTemplateConfig = {
  schema: typeof createMultiStringsQuestionTemplateSchema;
  map: typeof mapMultiStringsQuestionTemplate;
  input: CreateMultiStringsQuestionTemplateInput;
  output: MultiStringsQuestionTemplate;
};
type NumberQuestionTemplateConfig = {
  schema: typeof createNumberQuestionTemplateSchema;
  map: typeof mapNumberQuestionTemplate;
  input: CreateNumberQuestionTemplateInput;
  output: NumberQuestionTemplate;
};
type NumbersQuestionTemplateConfig = {
  schema: typeof createNumbersQuestionTemplateSchema;
  map: typeof mapNumbersQuestionTemplate;
  input: CreateNumbersQuestionTemplateInput;
  output: NumbersQuestionTemplate;
};
type MultiNumbersQuestionTemplateConfig = {
  schema: typeof createMultiNumbersQuestionTemplateSchema;
  map: typeof mapMultiNumbersQuestionTemplate;
  input: CreateMultiNumbersQuestionTemplateInput;
  output: MultiNumbersQuestionTemplate;
};
type FileQuestionTemplateConfig = {
  schema: typeof createFileQuestionTemplateSchema;
  map: typeof mapFileQuestionTemplate;
  input: CreateFileQuestionTemplateInput;
  output: FileQuestionTemplate;
};
type FilesQuestionTemplateConfig = {
  schema: typeof createFilesQuestionTemplateSchema;
  map: typeof mapFilesQuestionTemplate;
  input: CreateFilesQuestionTemplateInput;
  output: FilesQuestionTemplate;
};

export const createCreateQuestionTemplate = <
  Config extends
    | BooleanQuestionTemplateConfig
    | StringQuestionTemplateConfig
    | StringsQuestionTemplateConfig
    | MultiStringsQuestionTemplateConfig
    | NumberQuestionTemplateConfig
    | NumbersQuestionTemplateConfig
    | MultiNumbersQuestionTemplateConfig
    | FileQuestionTemplateConfig
    | FilesQuestionTemplateConfig
>(
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
    input: { rule, questionnaireConfigurationId, ...questionBase },
  } = args;

  if (!context.user) {
    throw new NotAuthenticatedError();
  }

  if (context.user.role !== AdminRole.admin) {
    throw new Forbidden();
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  const doc = await context.models.QuestionTemplate.create({
    ...questionBase,
    rule: rule ?? undefined,
    questionnaireConfiguration: questionnaireConfigurationId,
  });

  const questionnaireConfiguration = await context.models.QuestionnaireConfiguration.findOneAndUpdate(
    { _id: questionnaireConfigurationId },
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
    createBooleanQuestionTemplateSchema,
    mapBooleanQuestionTemplate,
  ),
  createStringQuestionTemplate: createCreateQuestionTemplate<StringQuestionTemplateConfig>(
    createStringQuestionTemplateSchema,
    mapStringQuestionTemplate,
  ),
  createStringsQuestionTemplate: createCreateQuestionTemplate<StringsQuestionTemplateConfig>(
    createStringsQuestionTemplateSchema,
    mapStringsQuestionTemplate,
  ),
  createMultiStringsQuestionTemplate: createCreateQuestionTemplate<MultiStringsQuestionTemplateConfig>(
    createMultiStringsQuestionTemplateSchema,
    mapMultiStringsQuestionTemplate,
  ),
  createNumberQuestionTemplate: createCreateQuestionTemplate<NumberQuestionTemplateConfig>(
    createNumberQuestionTemplateSchema,
    mapNumberQuestionTemplate,
  ),
  createNumbersQuestionTemplate: createCreateQuestionTemplate<NumbersQuestionTemplateConfig>(
    createNumbersQuestionTemplateSchema,
    mapNumbersQuestionTemplate,
  ),
  createMultiNumbersQuestionTemplate: createCreateQuestionTemplate<MultiNumbersQuestionTemplateConfig>(
    createMultiNumbersQuestionTemplateSchema,
    mapMultiNumbersQuestionTemplate,
  ),
  createFileQuestionTemplate: createCreateQuestionTemplate<FileQuestionTemplateConfig>(
    createFileQuestionTemplateSchema,
    mapFileQuestionTemplate,
  ),
  createFilesQuestionTemplate: createCreateQuestionTemplate<FilesQuestionTemplateConfig>(
    createFilesQuestionTemplateSchema,
    mapFilesQuestionTemplate,
  ),
  deleteQuestionTemplate,
};

type BooleanQuestionConfig = {
  schema: typeof createBooleanQuestionSchema;
  map: typeof mapBooleanQuestion;
  input: CreateBooleanQuestionInput;
  output: BooleanQuestion;
};
type StringQuestionConfig = {
  schema: typeof createStringsQuestionSchema;
  map: typeof mapStringQuestion;
  input: CreateStringQuestionInput;
  output: StringQuestion;
};
type StringsQuestionConfig = {
  schema: typeof createStringsQuestionSchema;
  map: typeof mapStringsQuestion;
  input: CreateStringsQuestionInput;
  output: StringsQuestion;
};
type MultiStringsQuestionConfig = {
  schema: typeof createMultiStringsQuestionSchema;
  map: typeof mapMultiStringsQuestion;
  input: CreateMultiStringsQuestionInput;
  output: MultiStringsQuestion;
};
type NumberQuestionConfig = {
  schema: typeof createNumberQuestionSchema;
  map: typeof mapNumberQuestion;
  input: CreateNumberQuestionInput;
  output: NumberQuestion;
};
type NumbersQuestionConfig = {
  schema: typeof createNumbersQuestionSchema;
  map: typeof mapNumbersQuestion;
  input: CreateNumbersQuestionInput;
  output: NumbersQuestion;
};
type MultiNumbersQuestionConfig = {
  schema: typeof createMultiNumbersQuestionSchema;
  map: typeof mapMultiNumbersQuestion;
  input: CreateMultiNumbersQuestionInput;
  output: MultiNumbersQuestion;
};
type FileQuestionConfig = {
  schema: typeof createFileQuestionSchema;
  map: typeof mapFileQuestion;
  input: CreateFileQuestionInput;
  output: FileQuestion;
};
type FilesQuestionConfig = {
  schema: typeof createFilesQuestionSchema;
  map: typeof mapFilesQuestion;
  input: CreateFilesQuestionInput;
  output: FilesQuestion;
};

export const createCreateQuestion = <
  Config extends
    | BooleanQuestionConfig
    | StringQuestionConfig
    | StringsQuestionConfig
    | MultiStringsQuestionConfig
    | NumberQuestionConfig
    | NumbersQuestionConfig
    | MultiNumbersQuestionConfig
    | FileQuestionConfig
    | FilesQuestionConfig
>(
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
    input: { questionnaireId, ...questionBase },
  } = args;

  if (!context.user) {
    throw new NotAuthenticatedError();
  }

  if (context.user.role !== AdminRole.admin) {
    throw new Forbidden();
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  const doc = await context.models.Question.create({
    ...questionBase,
    rule: args.input.rule ?? undefined,
    questionnaire: questionnaireId,
    answer: undefined,
  });

  const questionnaire = await context.models.Questionnaire.findOneAndUpdate(
    { _id: questionnaireId },
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

type BooleanUpdateQuestionConfig = {
  schema: typeof updateBooleanQuestionSchema;
  map: typeof mapBooleanQuestion;
  input: UpdateBooleanQuestionInput;
  output: BooleanQuestion;
};
type StringUpdateQuestionConfig = {
  schema: typeof updateStringsQuestionSchema;
  map: typeof mapStringQuestion;
  input: UpdateStringQuestionInput;
  output: StringQuestion;
};
type StringsUpdateQuestionConfig = {
  schema: typeof updateStringsQuestionSchema;
  map: typeof mapStringsQuestion;
  input: UpdateStringsQuestionInput;
  output: StringsQuestion;
};
type MultiStringsUpdateQuestionConfig = {
  schema: typeof updateMultiStringsQuestionSchema;
  map: typeof mapMultiStringsQuestion;
  input: UpdateMultiStringsQuestionInput;
  output: MultiStringsQuestion;
};
type NumberUpdateQuestionConfig = {
  schema: typeof updateNumberQuestionSchema;
  map: typeof mapNumberQuestion;
  input: UpdateNumberQuestionInput;
  output: NumberQuestion;
};
type NumbersUpdateQuestionConfig = {
  schema: typeof updateNumbersQuestionSchema;
  map: typeof mapNumbersQuestion;
  input: UpdateNumbersQuestionInput;
  output: NumbersQuestion;
};
type MultiNumbersUpdateQuestionConfig = {
  schema: typeof updateMultiNumbersQuestionSchema;
  map: typeof mapMultiNumbersQuestion;
  input: UpdateMultiNumbersQuestionInput;
  output: MultiNumbersQuestion;
};
type FileUpdateQuestionConfig = {
  schema: typeof updateFileQuestionSchema;
  map: typeof mapFileQuestion;
  input: UpdateFileQuestionInput;
  output: FileQuestion;
};
type FilesUpdateQuestionConfig = {
  schema: typeof updateFilesQuestionSchema;
  map: typeof mapFilesQuestion;
  input: UpdateFilesQuestionInput;
  output: FilesQuestion;
};

export const createUpdateQuestion = <
  Config extends
    | BooleanUpdateQuestionConfig
    | StringUpdateQuestionConfig
    | StringsUpdateQuestionConfig
    | MultiStringsUpdateQuestionConfig
    | NumberUpdateQuestionConfig
    | NumbersUpdateQuestionConfig
    | MultiNumbersUpdateQuestionConfig
    | FileUpdateQuestionConfig
    | FilesUpdateQuestionConfig
>(
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
    createBooleanQuestionSchema,
    mapBooleanQuestion,
  ),
  createStringQuestion: createCreateQuestion<StringQuestionConfig>(
    createStringQuestionSchema,
    mapStringQuestion,
  ),
  createStringsQuestion: createCreateQuestion<StringsQuestionConfig>(
    createStringsQuestionSchema,
    mapStringsQuestion,
  ),
  createMultiStringsQuestion: createCreateQuestion<MultiStringsQuestionConfig>(
    createMultiStringsQuestionSchema,
    mapMultiStringsQuestion,
  ),
  createNumberQuestion: createCreateQuestion<NumberQuestionConfig>(
    createNumberQuestionSchema,
    mapNumberQuestion,
  ),
  createNumbersQuestion: createCreateQuestion<NumbersQuestionConfig>(
    createNumbersQuestionSchema,
    mapNumbersQuestion,
  ),
  createMultiNumbersQuestion: createCreateQuestion<MultiNumbersQuestionConfig>(
    createMultiNumbersQuestionSchema,
    mapMultiNumbersQuestion,
  ),
  createFileQuestion: createCreateQuestion<FileQuestionConfig>(
    createFileQuestionSchema,
    mapFileQuestion,
  ),
  createFilesQuestion: createCreateQuestion<FilesQuestionConfig>(
    createFilesQuestionSchema,
    mapFilesQuestion,
  ),
  updateBooleanQuestion: createUpdateQuestion<BooleanUpdateQuestionConfig>(
    createBooleanQuestionSchema,
    mapBooleanQuestion,
  ),
  updateStringQuestion: createUpdateQuestion<StringUpdateQuestionConfig>(
    createStringQuestionSchema,
    mapStringQuestion,
  ),
  updateStringsQuestion: createUpdateQuestion<StringsUpdateQuestionConfig>(
    createStringsQuestionSchema,
    mapStringsQuestion,
  ),
  updateMultiStringsQuestion: createUpdateQuestion<MultiStringsUpdateQuestionConfig>(
    createMultiStringsQuestionSchema,
    mapMultiStringsQuestion,
  ),
  updateNumberQuestion: createUpdateQuestion<NumberUpdateQuestionConfig>(
    createNumberQuestionSchema,
    mapNumberQuestion,
  ),
  updateNumbersQuestion: createUpdateQuestion<NumbersUpdateQuestionConfig>(
    createNumbersQuestionSchema,
    mapNumbersQuestion,
  ),
  updateMultiNumbersQuestion: createUpdateQuestion<MultiNumbersUpdateQuestionConfig>(
    createMultiNumbersQuestionSchema,
    mapMultiNumbersQuestion,
  ),
  updateFileQuestion: createUpdateQuestion<FileUpdateQuestionConfig>(
    createFileQuestionSchema,
    mapFileQuestion,
  ),
  updateFilesQuestion: createUpdateQuestion<FilesUpdateQuestionConfig>(
    createFilesQuestionSchema,
    mapFilesQuestion,
  ),
  deleteQuestion,
};
