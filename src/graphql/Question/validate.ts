import { DocumentType } from '@typegoose/typegoose';
import joi from 'joi';
import { QuestionClass } from '../../classes/Question/Question';
import { QuestionTemplateClass } from '../../classes/Question/QuestionTemplate';
import {
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
  QuestionBase,
  UpdateBooleanQuestionInput,
  UpdateBooleanQuestionTemplateInput,
  UpdateFileQuestionInput,
  UpdateFileQuestionTemplateInput,
  UpdateFilesQuestionInput,
  UpdateFilesQuestionTemplateInput,
  UpdateMultiNumbersQuestionInput,
  UpdateMultiNumbersQuestionTemplateInput,
  UpdateMultiStringsQuestionInput,
  UpdateMultiStringsQuestionTemplateInput,
  UpdateNumberQuestionInput,
  UpdateNumberQuestionTemplateInput,
  UpdateNumbersQuestionInput,
  UpdateNumbersQuestionTemplateInput,
  UpdateStringQuestionInput,
  UpdateStringQuestionTemplateInput,
  UpdateStringsQuestionInput,
  UpdateStringsQuestionTemplateInput,
} from '../../generated/graphql';
import { QuestionType } from '../../interfaces/Type';
import { idSchema } from '../../utils/validate';

export const doesUpdateQuestionMatchQuestion = (
  type: QuestionType,
  questionDoc: DocumentType<QuestionTemplateClass | QuestionClass>,
): boolean => {
  switch (type) {
    case 'boolean':
      return !!questionDoc.boolean;
    case 'string':
      return !!questionDoc.string;
    case 'strings':
      return !!questionDoc.strings;
    case 'multiStrings':
      return !!questionDoc.multiStrings;
    case 'number':
      return !!questionDoc.number;
    case 'numbers':
      return !!questionDoc.numbers;
    case 'multiNumbers':
      return !!questionDoc.multiNumbers;
    case 'file':
      return !!questionDoc.file;
    case 'files':
      return !!questionDoc.files;
  }
};

type Base = Omit<QuestionBase, 'id'>;
const baseSchemaMap: joi.SchemaMap<Base> = {
  name: joi.string().required(),
  label: joi.string().required(),
  optional: joi.boolean().required(),
  rule: joi.string(), // TODO create parser
};

const createQuestionTemplateBaseSchemaMap: joi.SchemaMap<
  Base &
    Pick<CreateBooleanQuestionTemplateInput, 'questionnaireConfigurationId'>
> = {
  ...baseSchemaMap,
  questionnaireConfigurationId: idSchema,
};

export const createBooleanQuestionTemplateSchema = joi
  .object<CreateBooleanQuestionTemplateInput>({
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

const updateQuestionTemplateBaseSchemaMap: joi.SchemaMap<
  Omit<UpdateBooleanQuestionTemplateInput, 'default'>
> = {
  id: idSchema,
  name: joi.string(),
  label: joi.string(),
  optional: joi.boolean(),
  rule: joi.string(), // TODO create parser
};

export const updateBooleanQuestionTemplateSchema = joi
  .object<UpdateBooleanQuestionTemplateInput>({
    ...updateQuestionTemplateBaseSchemaMap,
    default: joi.boolean(),
  })
  .required();
export const updateStringQuestionTemplateSchema = joi
  .object<UpdateStringQuestionTemplateInput>({
    ...updateQuestionTemplateBaseSchemaMap,
    default: joi.string(),
  })
  .required();
export const updateStringsQuestionTemplateSchema = joi
  .object<UpdateStringsQuestionTemplateInput>({
    ...updateQuestionTemplateBaseSchemaMap,
    default: joi.string(),
  })
  .required();
export const updateMultiStringsQuestionTemplateSchema = joi
  .object<UpdateMultiStringsQuestionTemplateInput>({
    ...updateQuestionTemplateBaseSchemaMap,
    default: joi.array().items(joi.string()),
  })
  .required();
export const updateNumberQuestionTemplateSchema = joi
  .object<UpdateNumberQuestionTemplateInput>({
    ...updateQuestionTemplateBaseSchemaMap,
    default: joi.number(),
  })
  .required();
export const updateNumbersQuestionTemplateSchema = joi
  .object<UpdateNumbersQuestionTemplateInput>({
    ...updateQuestionTemplateBaseSchemaMap,
    default: joi.number(),
  })
  .required();
export const updateMultiNumbersQuestionTemplateSchema = joi
  .object<UpdateMultiNumbersQuestionTemplateInput>({
    ...updateQuestionTemplateBaseSchemaMap,
    default: joi.array().items(joi.number().required()),
  })
  .required();
export const updateFileQuestionTemplateSchema = joi
  .object<UpdateFileQuestionTemplateInput>({
    ...updateQuestionTemplateBaseSchemaMap,
    default: joi.string(),
  })
  .required();
export const updateFilesQuestionTemplateSchema = joi
  .object<UpdateFilesQuestionTemplateInput>({
    ...updateQuestionTemplateBaseSchemaMap,
    default: joi.array().items(joi.string()),
  })
  .required();

// Question
const createQuestionBaseSchemaMap: joi.SchemaMap<
  Base & Pick<CreateBooleanQuestionInput, 'questionnaireId'>
> = {
  name: joi.string().required(),
  label: joi.string().required(),
  optional: joi.boolean().required(),
  questionnaireId: idSchema,
};

export const createBooleanQuestionSchema = joi
  .object<CreateBooleanQuestionInput>({
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

const updateQuestionBaseSchemaMap: joi.SchemaMap<
  Omit<UpdateBooleanQuestionInput, 'default'>
> = {
  id: idSchema,
  name: joi.string(),
  label: joi.string(),
  optional: joi.boolean(),
  rule: joi.string(), // TODO create parser
};

export const updateBooleanQuestionSchema = joi
  .object<UpdateBooleanQuestionInput>({
    ...updateQuestionBaseSchemaMap,
    default: joi.boolean(),
  })
  .required();
export const updateStringQuestionSchema = joi
  .object<UpdateStringQuestionInput>({
    ...updateQuestionBaseSchemaMap,
    default: joi.string(),
  })
  .required();
export const updateStringsQuestionSchema = joi
  .object<UpdateStringsQuestionInput>({
    ...updateQuestionBaseSchemaMap,
    default: joi.string(),
  })
  .required();
export const updateMultiStringsQuestionSchema = joi
  .object<UpdateMultiStringsQuestionInput>({
    ...updateQuestionBaseSchemaMap,
    default: joi.array().items(joi.string()),
  })
  .required();
export const updateNumberQuestionSchema = joi
  .object<UpdateNumberQuestionInput>({
    ...updateQuestionBaseSchemaMap,
    default: joi.number(),
  })
  .required();
export const updateNumbersQuestionSchema = joi
  .object<UpdateNumbersQuestionInput>({
    ...updateQuestionBaseSchemaMap,
    default: joi.number(),
  })
  .required();
export const updateMultiNumbersQuestionSchema = joi
  .object<UpdateMultiNumbersQuestionInput>({
    ...updateQuestionBaseSchemaMap,
    default: joi.array().items(joi.number().required()),
  })
  .required();
export const updateFileQuestionSchema = joi
  .object<UpdateFileQuestionInput>({
    ...updateQuestionBaseSchemaMap,
    default: joi.string(),
  })
  .required();
export const updateFilesQuestionSchema = joi
  .object<UpdateFilesQuestionInput>({
    ...updateQuestionBaseSchemaMap,
    default: joi.array().items(joi.string()),
  })
  .required();
