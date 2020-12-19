import joi from 'joi';
import { CreateQuestionnaireInput } from '../../generated/graphql';
import { idSchema } from '../../utils/validate';

export const createQuestionnaireInputSchema = joi
  .object<CreateQuestionnaireInput>({
    name: joi.string().required(),
    questionnaireConfigurationId: idSchema,
  })
  .required();
