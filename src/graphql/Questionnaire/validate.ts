import joi from 'joi';
import {
  CreateQuestionnaireInput,
  Questionnaire,
  UpdateQuestionnaireInput,
} from '../../generated/graphql';
import { idSchema } from '../../utils/validate';

const questionnaireBaseSchemaMap: joi.SchemaMap<Pick<Questionnaire, 'name'>> = {
  name: joi.string().required(),
};

export const createQuestionnaireInputSchema = joi
  .object<CreateQuestionnaireInput>({
    ...questionnaireBaseSchemaMap,
    questionnaireConfigurationId: idSchema,
  })
  .required();

export const updateQuestionnaireInputSchema = joi
  .object<UpdateQuestionnaireInput>({
    ...questionnaireBaseSchemaMap,
    id: idSchema,
  })
  .required();
