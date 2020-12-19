import { Context } from 'vm';
import {
  AdminRole,
  CreateFileQuestionTemplateInput,
  CreateFilesQuestionTemplateInput,
  CreateMultiNumbersQuestionTemplateInput,
  CreateMultiStringsQuestionTemplateInput,
  CreateNumberQuestionTemplateInput,
  CreateNumbersQuestionTemplateInput,
  CreateStringQuestionTemplateInput,
  CreateStringsQuestionTemplateInput,
  CreateYesNoQuestionTemplateInput,
  FileQuestionTemplate,
  FilesQuestionTemplate,
  MultiNumbersQuestionTemplate,
  MultiStringsQuestionTemplate,
  NumberQuestionTemplate,
  NumbersQuestionTemplate,
  StringQuestionTemplate,
  StringsQuestionTemplate,
  YesNoQuestionTemplate,
} from '../../generated/graphql';
import {
  QuestionnaireConfigurationModel,
  QuestionTemplateModel,
} from '../../services/models';
import { Forbidden } from '../../utils/errors';
import {
  mapFileQuestionTemplate,
  mapFilesQuestionTemplate,
  mapMultiNumbersQuestionTemplate,
  mapMultiStringsQuestionTemplate,
  mapNumberQuestionTemplate,
  mapNumbersQuestionTemplate,
  mapStringQuestionTemplate,
  mapStringsQuestionTemplate,
  mapYesNoQuestionTemplate,
} from './map';
import {
  createFileQuestionTemplateSchema,
  createFilesQuestionTemplateSchema,
  createMultiNumbersQuestionTemplateSchema,
  createMultiStringsQuestionTemplateSchema,
  createNumberQuestionTemplateSchema,
  createNumbersQuestionTemplateSchema,
  createStringQuestionTemplateSchema,
  createStringsQuestionTemplateSchema,
  createYesNoQuestionTemplateSchema,
} from './validate';

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

  if (context.user?.role !== AdminRole.admin) {
    throw new Forbidden();
  }

  const questionnaireConfiguration = await QuestionnaireConfigurationModel.findById(
    questionnaireConfigurationId,
  );

  if (!questionnaireConfiguration) {
    throw new Error();
  }

  const doc = await QuestionTemplateModel.create({
    ...questionBase,
    rule: rule ?? undefined,
    questionnaireConfiguration: questionnaireConfigurationId,
  });

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
