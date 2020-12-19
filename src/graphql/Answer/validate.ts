import Joi from 'joi';
import { CreateYesNoAnswerInput } from '../../generated/graphql';
import { idSchema } from '../../utils/validate';

const createAnswerBaseSchemaMap: Joi.SchemaMap<
  Pick<CreateYesNoAnswerInput, 'questionId'>
> = {
  questionId: idSchema,
};

export const createYesNoAnswerSchema = Joi.object({
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
