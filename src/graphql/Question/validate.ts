import joi from 'joi';
import {
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
  QuestionBase,
} from '../../generated/graphql';
import { idSchema } from '../../utils/validate';

type Base = Omit<QuestionBase, 'id'>;
const baseSchemaMap: joi.SchemaMap<Base> = {
  name: joi.string().required(),
  label: joi.string().required(),
  optional: joi.boolean().required(),
};

const createQuestionTemplateBaseSchemaMap: joi.SchemaMap<
  Base & Pick<CreateYesNoQuestionTemplateInput, 'questionnaireConfigurationId'>
> = {
  ...baseSchemaMap,
  questionnaireConfigurationId: idSchema,
  rule: joi.string(), // TODO create parser
};

export const createYesNoQuestionTemplateSchema = joi
  .object<CreateYesNoQuestionTemplateInput>({
    ...createQuestionTemplateBaseSchemaMap,
    default: joi.boolean(),
  })
  .required();
export const createStringQuestionTemplateSchema = joi
  .object<CreateStringQuestionTemplateInput>({
    ...createQuestionTemplateBaseSchemaMap,
    default: joi.string(),
  })
  .required();
export const createStringsQuestionTemplateSchema = joi
  .object<CreateStringsQuestionTemplateInput>({
    ...createQuestionTemplateBaseSchemaMap,
    default: joi.string(),
  })
  .required();
export const createMultiStringsQuestionTemplateSchema = joi
  .object<CreateMultiStringsQuestionTemplateInput>({
    ...createQuestionTemplateBaseSchemaMap,
    default: joi.array().items(joi.string()),
  })
  .required();
export const createNumberQuestionTemplateSchema = joi
  .object<CreateNumberQuestionTemplateInput>({
    ...createQuestionTemplateBaseSchemaMap,
    default: joi.number(),
  })
  .required();
export const createNumbersQuestionTemplateSchema = joi
  .object<CreateNumbersQuestionTemplateInput>({
    ...createQuestionTemplateBaseSchemaMap,
    default: joi.number(),
  })
  .required();
export const createMultiNumbersQuestionTemplateSchema = joi
  .object<CreateMultiNumbersQuestionTemplateInput>({
    ...createQuestionTemplateBaseSchemaMap,
    default: joi.array().items(joi.number().required()),
  })
  .required();
export const createFileQuestionTemplateSchema = joi
  .object<CreateFileQuestionTemplateInput>({
    ...createQuestionTemplateBaseSchemaMap,
    default: joi.string(),
  })
  .required();
export const createFilesQuestionTemplateSchema = joi
  .object<CreateFilesQuestionTemplateInput>({
    ...createQuestionTemplateBaseSchemaMap,
    default: joi.array().items(joi.string()),
  })
  .required();

// Question
const createQuestionBaseSchemaMap: joi.SchemaMap<
  Base & Pick<CreateYesNoQuestionInput, 'questionnaireId'>
> = {
  name: joi.string().required(),
  label: joi.string().required(),
  optional: joi.boolean().required(),
  questionnaireId: idSchema,
};

export const createYesNoQuestionSchema = joi
  .object<CreateYesNoQuestionInput>({
    ...createQuestionBaseSchemaMap,
    default: joi.boolean(),
  })
  .required();
export const createStringQuestionSchema = joi
  .object<CreateStringQuestionInput>({
    ...createQuestionBaseSchemaMap,
    default: joi.string(),
  })
  .required();
export const createStringsQuestionSchema = joi
  .object<CreateStringsQuestionInput>({
    ...createQuestionBaseSchemaMap,
    default: joi.string(),
  })
  .required();
export const createMultiStringsQuestionSchema = joi
  .object<CreateMultiStringsQuestionInput>({
    ...createQuestionBaseSchemaMap,
    default: joi.array().items(joi.string()),
  })
  .required();
export const createNumberQuestionSchema = joi
  .object<CreateNumberQuestionInput>({
    ...createQuestionBaseSchemaMap,
    default: joi.number(),
  })
  .required();
export const createNumbersQuestionSchema = joi
  .object<CreateNumbersQuestionInput>({
    ...createQuestionBaseSchemaMap,
    default: joi.number(),
  })
  .required();
export const createMultiNumbersQuestionSchema = joi
  .object<CreateMultiNumbersQuestionInput>({
    ...createQuestionBaseSchemaMap,
    default: joi.array().items(joi.number().required()),
  })
  .required();
export const createFileQuestionSchema = joi
  .object<CreateFileQuestionInput>({
    ...createQuestionBaseSchemaMap,
    default: joi.string(),
  })
  .required();
export const createFilesQuestionSchema = joi
  .object<CreateFilesQuestionInput>({
    ...createQuestionBaseSchemaMap,
    default: joi.array().items(joi.string()),
  })
  .required();
