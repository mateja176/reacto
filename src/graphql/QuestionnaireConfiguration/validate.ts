import joi from 'joi';
import { CreateQuestionnaireConfigurationInput } from '../../generated/graphql';

export const createQuestionnaireConfigurationSchema = joi
  .object<CreateQuestionnaireConfigurationInput>({
    name: joi.string().required(),
    type: joi.string().required(),
  })
  .required();
