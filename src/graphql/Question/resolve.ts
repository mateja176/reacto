import { DocumentType, mongoose } from '@typegoose/typegoose';
import { isNil } from 'ramda';
import { QuestionClass } from '../../classes/Question/Question';
import { QuestionnaireClass } from '../../classes/Questionnaire/Questionnaire';
import { Context } from '../../Context';
import {
  AdminRole,
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
  CreateYesNoQuestionInput,
  CreateYesNoQuestionTemplateInput,
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
  UpdateFileQuestionInput,
  UpdateFilesQuestionInput,
  UpdateMultiNumbersQuestionInput,
  UpdateMultiStringsQuestionInput,
  UpdateNumberQuestionInput,
  UpdateNumbersQuestionInput,
  UpdateStringQuestionInput,
  UpdateStringsQuestionInput,
  UpdateYesNoQuestionInput,
  YesNoQuestion,
  YesNoQuestionTemplate,
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
  mapYesNoQuestion,
  mapYesNoQuestionTemplate,
} from './map';
import {
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
  createYesNoQuestionSchema,
  createYesNoQuestionTemplateSchema,
  updateFileQuestionSchema,
  updateFilesQuestionSchema,
  updateMultiNumbersQuestionSchema,
  updateMultiStringsQuestionSchema,
  updateNumberQuestionSchema,
  updateNumbersQuestionSchema,
  updateStringsQuestionSchema,
  updateYesNoQuestionSchema,
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

type YesNoQuestionTemplateConfig = [
  typeof createYesNoQuestionTemplateSchema,
  typeof mapYesNoQuestionTemplate,
  CreateYesNoQuestionTemplateInput,
  YesNoQuestionTemplate,
];
type StringQuestionTemplateConfig = [
  typeof createStringsQuestionTemplateSchema,
  typeof mapStringQuestionTemplate,
  CreateStringQuestionTemplateInput,
  StringQuestionTemplate,
];
type StringsQuestionTemplateConfig = [
  typeof createStringsQuestionTemplateSchema,
  typeof mapStringsQuestionTemplate,
  CreateStringsQuestionTemplateInput,
  StringsQuestionTemplate,
];
type MultiStringsQuestionTemplateConfig = [
  typeof createMultiStringsQuestionTemplateSchema,
  typeof mapMultiStringsQuestionTemplate,
  CreateMultiStringsQuestionTemplateInput,
  MultiStringsQuestionTemplate,
];
type NumberQuestionTemplateConfig = [
  typeof createNumberQuestionTemplateSchema,
  typeof mapNumberQuestionTemplate,
  CreateNumberQuestionTemplateInput,
  NumberQuestionTemplate,
];
type NumbersQuestionTemplateConfig = [
  typeof createNumbersQuestionTemplateSchema,
  typeof mapNumbersQuestionTemplate,
  CreateNumbersQuestionTemplateInput,
  NumbersQuestionTemplate,
];
type MultiNumbersQuestionTemplateConfig = [
  typeof createMultiNumbersQuestionTemplateSchema,
  typeof mapMultiNumbersQuestionTemplate,
  CreateMultiNumbersQuestionTemplateInput,
  MultiNumbersQuestionTemplate,
];
type FileQuestionTemplateConfig = [
  typeof createFileQuestionTemplateSchema,
  typeof mapFileQuestionTemplate,
  CreateFileQuestionTemplateInput,
  FileQuestionTemplate,
];
type FilesQuestionTemplateConfig = [
  typeof createFilesQuestionTemplateSchema,
  typeof mapFilesQuestionTemplate,
  CreateFilesQuestionTemplateInput,
  FilesQuestionTemplate,
];

export const createCreateQuestionTemplate = <
  Config extends
    | YesNoQuestionTemplateConfig
    | StringQuestionTemplateConfig
    | StringsQuestionTemplateConfig
    | MultiStringsQuestionTemplateConfig
    | NumberQuestionTemplateConfig
    | NumbersQuestionTemplateConfig
    | MultiNumbersQuestionTemplateConfig
    | FileQuestionTemplateConfig
    | FilesQuestionTemplateConfig
>(
  schema: Config[0],
  map: Config[1],
) => async (
  _: never,
  args: {
    input: Config[2];
  },
  context: Context,
): Promise<Config[3]> => {
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
  createYesNoQuestionTemplate: createCreateQuestionTemplate<YesNoQuestionTemplateConfig>(
    createYesNoQuestionTemplateSchema,
    mapYesNoQuestionTemplate,
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

type YesNoQuestionConfig = [
  typeof createYesNoQuestionSchema,
  typeof mapYesNoQuestion,
  CreateYesNoQuestionInput,
  YesNoQuestion,
];
type StringQuestionConfig = [
  typeof createStringsQuestionSchema,
  typeof mapStringQuestion,
  CreateStringQuestionInput,
  StringQuestion,
];
type StringsQuestionConfig = [
  typeof createStringsQuestionSchema,
  typeof mapStringsQuestion,
  CreateStringsQuestionInput,
  StringsQuestion,
];
type MultiStringsQuestionConfig = [
  typeof createMultiStringsQuestionSchema,
  typeof mapMultiStringsQuestion,
  CreateMultiStringsQuestionInput,
  MultiStringsQuestion,
];
type NumberQuestionConfig = [
  typeof createNumberQuestionSchema,
  typeof mapNumberQuestion,
  CreateNumberQuestionInput,
  NumberQuestion,
];
type NumbersQuestionConfig = [
  typeof createNumbersQuestionSchema,
  typeof mapNumbersQuestion,
  CreateNumbersQuestionInput,
  NumbersQuestion,
];
type MultiNumbersQuestionConfig = [
  typeof createMultiNumbersQuestionSchema,
  typeof mapMultiNumbersQuestion,
  CreateMultiNumbersQuestionInput,
  MultiNumbersQuestion,
];
type FileQuestionConfig = [
  typeof createFileQuestionSchema,
  typeof mapFileQuestion,
  CreateFileQuestionInput,
  FileQuestion,
];
type FilesQuestionConfig = [
  typeof createFilesQuestionSchema,
  typeof mapFilesQuestion,
  CreateFilesQuestionInput,
  FilesQuestion,
];

export const createCreateQuestion = <
  Config extends
    | YesNoQuestionConfig
    | StringQuestionConfig
    | StringsQuestionConfig
    | MultiStringsQuestionConfig
    | NumberQuestionConfig
    | NumbersQuestionConfig
    | MultiNumbersQuestionConfig
    | FileQuestionConfig
    | FilesQuestionConfig
>(
  schema: Config[0],
  map: Config[1],
) => async (
  _: never,
  args: {
    input: Config[2];
  },
  context: Context,
): Promise<Config[3]> => {
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

type YesNoUpdateQuestionConfig = [
  typeof updateYesNoQuestionSchema,
  typeof mapYesNoQuestion,
  UpdateYesNoQuestionInput,
  YesNoQuestion,
];
type StringUpdateQuestionConfig = [
  typeof updateStringsQuestionSchema,
  typeof mapStringQuestion,
  UpdateStringQuestionInput,
  StringQuestion,
];
type StringsUpdateQuestionConfig = [
  typeof updateStringsQuestionSchema,
  typeof mapStringsQuestion,
  UpdateStringsQuestionInput,
  StringsQuestion,
];
type MultiStringsUpdateQuestionConfig = [
  typeof updateMultiStringsQuestionSchema,
  typeof mapMultiStringsQuestion,
  UpdateMultiStringsQuestionInput,
  MultiStringsQuestion,
];
type NumberUpdateQuestionConfig = [
  typeof updateNumberQuestionSchema,
  typeof mapNumberQuestion,
  UpdateNumberQuestionInput,
  NumberQuestion,
];
type NumbersUpdateQuestionConfig = [
  typeof updateNumbersQuestionSchema,
  typeof mapNumbersQuestion,
  UpdateNumbersQuestionInput,
  NumbersQuestion,
];
type MultiNumbersUpdateQuestionConfig = [
  typeof updateMultiNumbersQuestionSchema,
  typeof mapMultiNumbersQuestion,
  UpdateMultiNumbersQuestionInput,
  MultiNumbersQuestion,
];
type FileUpdateQuestionConfig = [
  typeof updateFileQuestionSchema,
  typeof mapFileQuestion,
  UpdateFileQuestionInput,
  FileQuestion,
];
type FilesUpdateQuestionConfig = [
  typeof updateFilesQuestionSchema,
  typeof mapFilesQuestion,
  UpdateFilesQuestionInput,
  FilesQuestion,
];

export const createUpdateQuestion = <
  Config extends
    | YesNoUpdateQuestionConfig
    | StringUpdateQuestionConfig
    | StringsUpdateQuestionConfig
    | MultiStringsUpdateQuestionConfig
    | NumberUpdateQuestionConfig
    | NumbersUpdateQuestionConfig
    | MultiNumbersUpdateQuestionConfig
    | FileUpdateQuestionConfig
    | FilesUpdateQuestionConfig
>(
  schema: Config[0],
  map: Config[1],
) => async (
  _: never,
  args: {
    input: Config[2];
  },
  context: Context,
): Promise<Config[3]> => {
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
  createYesNoQuestion: createCreateQuestion<YesNoQuestionConfig>(
    createYesNoQuestionSchema,
    mapYesNoQuestion,
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
  updateYesNoQuestion: createUpdateQuestion<YesNoUpdateQuestionConfig>(
    createYesNoQuestionSchema,
    mapYesNoQuestion,
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
