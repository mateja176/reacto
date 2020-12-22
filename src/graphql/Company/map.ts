import { DocumentType } from '@typegoose/typegoose';
import { CompanyClass } from '../../classes/Company/Company';
import { Company } from '../../generated/graphql';
import { Models } from '../../services/models';
import { mapDoc } from '../../utils/map';
import { createFind, createFindMany } from '../../utils/query';
import { mapQuestionnaire } from '../Questionnaire/map';
import { mapQuestionnaireConfiguration } from '../QuestionnaireConfiguration/map';
import { mapAdminUser, mapUser } from '../User/map';

export const mapCompany = (models: Models) => (
  companyDoc: DocumentType<CompanyClass>,
): Company => {
  const {
    owner,
    users,
    questionnaires,
    questionnaireConfigurations,
    ...company
  } = mapDoc(companyDoc);

  return {
    __typename: 'Company',
    ...company,
    owner: createFind({
      Model: models.User,
      map: mapAdminUser(models),
      ref: owner,
    }),
    users: createFindMany({
      Model: models.User,
      map: mapUser(models),
      refs: users,
    }),
    questionnaires: createFindMany({
      Model: models.Questionnaire,
      map: mapQuestionnaire(models),
      refs: questionnaires,
    }),
    questionnaireConfigurations: createFindMany({
      Model: models.QuestionnaireConfiguration,
      map: mapQuestionnaireConfiguration(models),
      refs: questionnaireConfigurations,
    }),
  };
};
