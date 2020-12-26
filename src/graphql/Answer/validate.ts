import Joi from 'joi';
import { CreateBooleanAnswerInput } from '../../generated/graphql';
import { idSchema } from '../../utils/validate';

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
