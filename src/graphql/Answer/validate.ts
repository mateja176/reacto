import { DocumentType } from '@typegoose/typegoose';
import Joi from 'joi';
import { QuestionClass } from '../../classes/Question/Question';
import { CreateBooleanAnswerInput } from '../../generated/graphql';
import { AnswerType } from '../../interfaces/Type';
import { idSchema } from '../../utils/validate';

export const doesAnswerMatchQuestion = (
  type: AnswerType,
  questionDoc: DocumentType<QuestionClass>,
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

const createAnswerBaseSchemaMap: Joi.SchemaMap<
  Pick<CreateBooleanAnswerInput, 'questionId'>
> = {
  questionId: idSchema,
};

export const createBooleanAnswerSchema = Joi.object({
  ...createAnswerBaseSchemaMap,
  answer: Joi.boolean().required(),
}).required();
export const createStringAnswerSchema = Joi.object({
  ...createAnswerBaseSchemaMap,
  answer: Joi.string().required(),
}).required();
export const createStringsAnswerSchema = Joi.object({
  ...createAnswerBaseSchemaMap,
  answer: Joi.string().required(),
}).required();
export const createMultiStringsAnswerSchema = Joi.object({
  ...createAnswerBaseSchemaMap,
  answer: Joi.array().items(Joi.string().required()),
}).required();
export const createNumberAnswerSchema = Joi.object({
  ...createAnswerBaseSchemaMap,
  answer: Joi.number().required(),
}).required();
export const createNumbersAnswerSchema = Joi.object({
  ...createAnswerBaseSchemaMap,
  answer: Joi.number().required(),
}).required();
export const createMultiNumbersAnswerSchema = Joi.object({
  ...createAnswerBaseSchemaMap,
  answer: Joi.array().items(Joi.number().required()).required(),
}).required();
export const createFileAnswerSchema = Joi.object({
  ...createAnswerBaseSchemaMap,
  answer: Joi.string().required(),
}).required();
export const createFilesAnswerSchema = Joi.object({
  ...createAnswerBaseSchemaMap,
  answer: Joi.array().items(Joi.string().required()).required(),
}).required();

export const updateBooleanAnswerSchema = Joi.object({
  answer: Joi.boolean().required(),
}).required();
export const updateStringAnswerSchema = Joi.object({
  answer: Joi.string().required(),
}).required();
export const updateStringsAnswerSchema = Joi.object({
  answer: Joi.string().required(),
}).required();
export const updateMultiStringsAnswerSchema = Joi.object({
  answer: Joi.array().items(Joi.string().required()),
}).required();
export const updateNumberAnswerSchema = Joi.object({
  answer: Joi.number().required(),
}).required();
export const updateNumbersAnswerSchema = Joi.object({
  answer: Joi.number().required(),
}).required();
export const updateMultiNumbersAnswerSchema = Joi.object({
  answer: Joi.array().items(Joi.number().required()).required(),
}).required();
export const updateFileAnswerSchema = Joi.object({
  answer: Joi.string().required(),
}).required();
export const updateFilesAnswerSchema = Joi.object({
  answer: Joi.array().items(Joi.string().required()).required(),
}).required();
