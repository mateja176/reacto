import { DocumentType } from '@typegoose/typegoose';
import { CompanyClass } from '../../classes/Company/Company';
import { Company } from '../../generated/graphql';
import { mapDoc } from '../../utils/map';
import {
  createFindQuestionnaireConfigurations,
  createFindQuestionnaires,
  createFindUser,
  createFindUsers,
} from '../../utils/query';
import { mapQuestionnaire } from '../Questionnaire/map';
import { mapQuestionnaireConfiguration } from '../QuestionnaireConfiguration/map';
import { mapAdminUser, mapUser } from '../User/map';

export const mapCompany = (companyDoc: DocumentType<CompanyClass>): Company => {
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
    owner: createFindUser(mapAdminUser)(owner),
    users: createFindUsers(mapUser)(users),
    questionnaires: createFindQuestionnaires(mapQuestionnaire)(questionnaires),
    questionnaireConfigurations: createFindQuestionnaireConfigurations(
      mapQuestionnaireConfiguration,
    )(questionnaireConfigurations),
  };
};
