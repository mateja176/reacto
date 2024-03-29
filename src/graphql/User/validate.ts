import joi from 'joi';
import {
  InviteInput,
  LoginInput,
  RegisterInput,
} from '../../generated/graphql';
import { passwordSchema } from '../../utils/validate';

export const loginArgsSchema = joi
  .object<LoginInput>({
    email: joi.string().required().email(),
    password: passwordSchema,
  })
  .required();

export const inviteInputSchema = joi
  .object<InviteInput>({
    email: joi.string().required().email(),
    role: joi.string().required(),
  })
  .required();

export const registerInputSchema = joi
  .object<RegisterInput>({
    token: joi.string().required().uuid(),
    name: joi.string().required(),
    password: passwordSchema,
  })
  .required();
