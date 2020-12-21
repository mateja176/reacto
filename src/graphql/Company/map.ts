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
    owner: createFind(models.User)(mapAdminUser(models))(owner),
    users: createFindMany(models.User)(mapUser(models))(users),
    questionnaires: createFindMany(models.Questionnaire)(
      mapQuestionnaire(models),
    )(questionnaires),
    questionnaireConfigurations: createFindMany(
      models.QuestionnaireConfiguration,
    )(mapQuestionnaireConfiguration(models))(questionnaireConfigurations),
  };
};
