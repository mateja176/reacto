import joi from 'joi';
import {
  CreateQuestionnaireConfigurationInput,
  UpdateQuestionnaireConfigurationInput,
} from '../../generated/graphql';
import { idSchema } from '../../utils/validate';

const questionnaireConfigurationBase: joi.SchemaMap<CreateQuestionnaireConfigurationInput> = {
  name: joi.string().required(),
  type: joi.string().required(),
};

export const createQuestionnaireConfigurationSchema = joi
  .object<CreateQuestionnaireConfigurationInput>(questionnaireConfigurationBase)
  .required();

export const updateQuestionnaireConfigurationSchema = joi
  .object<UpdateQuestionnaireConfigurationInput>({
    ...questionnaireConfigurationBase,
    id: idSchema,
  })
  .required();
