import joi from 'joi';
import {
  CreateFileQuestionTemplateInput,
  CreateFilesQuestionTemplateInput,
  CreateMultiNumbersQuestionTemplateInput,
  CreateMultiStringsQuestionTemplateInput,
  CreateNumberQuestionTemplateInput,
  CreateNumbersQuestionTemplateInput,
  CreateStringQuestionTemplateInput,
  CreateStringsQuestionTemplateInput,
  CreateYesNoQuestionTemplateInput,
  QuestionBase,
} from '../../generated/graphql';
import { idSchema } from '../../utils/validate';

const createQuestionBaseSchemaMap: joi.SchemaMap<
  Omit<QuestionBase, 'id'> &
    Pick<CreateYesNoQuestionTemplateInput, 'questionnaireConfigurationId'>
> = {
  name: joi.string().required(),
  label: joi.string().required(),
  optional: joi.boolean().required(),
  questionnaireConfigurationId: idSchema,
  rule: joi.string(), // TODO create parser
};

export const createYesNoQuestionTemplateSchema = joi
  .object<CreateYesNoQuestionTemplateInput>({
    ...createQuestionBaseSchemaMap,
    default: joi.boolean(),
  })
  .required();
export const createStringQuestionTemplateSchema = joi
  .object<CreateStringQuestionTemplateInput>({
    ...createQuestionBaseSchemaMap,
    default: joi.string(),
  })
  .required();
export const createStringsQuestionTemplateSchema = joi
  .object<CreateStringsQuestionTemplateInput>({
    ...createQuestionBaseSchemaMap,
    default: joi.string(),
  })
  .required();
export const createMultiStringsQuestionTemplateSchema = joi
  .object<CreateMultiStringsQuestionTemplateInput>({
    ...createQuestionBaseSchemaMap,
    default: joi.array().items(joi.string()),
  })
  .required();
export const createNumberQuestionTemplateSchema = joi
  .object<CreateNumberQuestionTemplateInput>({
    ...createQuestionBaseSchemaMap,
    default: joi.boolean(),
  })
  .required();
export const createNumbersQuestionTemplateSchema = joi
  .object<CreateNumbersQuestionTemplateInput>({
    ...createQuestionBaseSchemaMap,
    default: joi.boolean(),
  })
  .required();
export const createMultiNumbersQuestionTemplateSchema = joi
  .object<CreateMultiNumbersQuestionTemplateInput>({
    ...createQuestionBaseSchemaMap,
    default: joi.boolean(),
  })
  .required();
export const createFileQuestionTemplateSchema = joi
  .object<CreateFileQuestionTemplateInput>({
    ...createQuestionBaseSchemaMap,
    default: joi.string(),
  })
  .required();
export const createFilesQuestionTemplateSchema = joi
  .object<CreateFilesQuestionTemplateInput>({
    ...createQuestionBaseSchemaMap,
    default: joi.array().items(joi.string()),
  })
  .required();
