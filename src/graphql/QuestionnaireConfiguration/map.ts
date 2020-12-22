import { DocumentType } from '@typegoose/typegoose';
import { QuestionnaireConfigurationClass } from '../../classes/QuestionnaireConfiguration/QuestionnaireConfiguration';
import { QuestionnaireConfiguration } from '../../generated/graphql';
import { Models } from '../../services/models';
import { mapDoc } from '../../utils/map';
import { createFind, createFindMany } from '../../utils/query';
import { mapCompany } from '../Company/map';
import { mapQuestionTemplate } from '../Question/map';
import { mapUser } from '../User/map';

export const mapQuestionnaireConfiguration = (models: Models) => (
  doc: DocumentType<QuestionnaireConfigurationClass>,
): QuestionnaireConfiguration => {
  const {
    company,
    user,
    questionTemplates,
    ...questionnaireConfiguration
  } = mapDoc(doc);

  return {
    __typename: 'QuestionnaireConfiguration',
    ...questionnaireConfiguration,
    company: createFind({
      Model: models.Company,
      map: mapCompany(models),
      ref: company,
    }),
    user: createFind({ Model: models.User, map: mapUser(models), ref: user }),
    questionTemplates: createFindMany({
      Model: models.QuestionTemplate,
      map: mapQuestionTemplate(models),
      refs: questionTemplates,
    }),
  };
};
