import mongoose from 'mongoose';
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
  NumberQuestion,
  NumberQuestionTemplate,
  NumbersQuestion,
  NumbersQuestionTemplate,
  Query,
  StringQuestion,
  StringQuestionTemplate,
  StringsQuestion,
  StringsQuestionTemplate,
  YesNoQuestion,
  YesNoQuestionTemplate,
} from '../../generated/graphql';
import {
  QuestionModel,
  QuestionnaireConfigurationModel,
  QuestionnaireModel,
  QuestionTemplateModel,
} from '../../services/models';
import {
  Forbidden,
  NotAuthenticatedError,
  NotFoundError,
  QuestionnaireConfigurationNotFound,
} from '../../utils/errors';
import { filterInputSchema, ValidatedFilterInput } from '../../utils/validate';
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

  const questionTemplateDocs = await QuestionTemplateModel.find({
    company: context.user.company.id,
  })
    .skip(skip)
    .limit(limit);

  return questionTemplateDocs.map(mapQuestionTemplate);
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

  const doc = await QuestionTemplateModel.create({
    ...questionBase,
    rule: rule ?? undefined,
    questionnaireConfiguration: questionnaireConfigurationId,
  });

  const questionnaireConfiguration = await QuestionnaireConfigurationModel.findOneAndUpdate(
    { _id: questionnaireConfigurationId },
    { $push: { questionTemplates: doc._id } },
  );

  if (!questionnaireConfiguration) {
    throw new QuestionnaireConfigurationNotFound();
  }

  await session.commitTransaction();
  session.endSession();

  const output = map(doc);

  return output;
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

  const doc = await QuestionModel.create({
    ...questionBase,
    rule: args.input.rule ?? undefined,
    questionnaire: questionnaireId,
    answer: undefined,
  });

  const questionnaire = await QuestionnaireModel.findOneAndUpdate(
    { _id: questionnaireId },
    { $push: { questions: doc._id } },
  );

  if (!questionnaire) {
    throw new NotFoundError();
  }

  await session.commitTransaction();
  session.endSession();

  const output = map(doc);

  return output;
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
};
