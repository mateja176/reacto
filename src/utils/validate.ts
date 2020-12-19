import joi from 'joi';
import { DeepNonNullable } from 'utility-types';
import { FilterInput } from '../generated/graphql';

export type ValidatedFilterInput = DeepNonNullable<FilterInput>;
// * in regards to `empty(null)` https://github.com/sideway/joi/issues/1684
export const filterInputSchema = joi
  .object<FilterInput>({
    skip: joi.number().integer().empty(null).default(0),
    limit: joi.number().integer().max(100).empty(null).default(20),
  })
  .required();

export const idSchema = joi.string().required();

export const passwordSchema = joi
  .string()
  .required()
  .custom((value: string, helper) => {
    return (
      (!!value &&
        value.length > 8 &&
        /[A-Z]/.test(value) &&
        [/[0-9]/, /[\W\D]/].map((regex) => regex.test(value)).filter(Boolean)
          .length >= 1) ||
      helper.message({
        invalidPassword: 'Password must be at least 8 characters long',
      })
    );
  });
