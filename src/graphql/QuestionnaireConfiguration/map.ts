import { DocumentType } from '@typegoose/typegoose';
import { QuestionnaireConfigurationClass } from '../../classes/QuestionnaireConfiguration/QuestionnaireConfiguration';
import { QuestionnaireConfiguration } from '../../generated/graphql';
import { mapDoc } from '../../utils/map';
import {
  createFindCompany,
  createFindQuestionTemplates,
  createFindUser,
} from '../../utils/query';
import { mapCompany } from '../Company/map';
import { mapQuestionTemplate } from '../Question/map';
import { mapUser } from '../User/map';

export const mapQuestionnaireConfiguration = (
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
    company: createFindCompany(mapCompany)(company),
    user: createFindUser(mapUser)(user),
    questionTemplates: createFindQuestionTemplates(mapQuestionTemplate)(
      questionTemplates,
    ),
  };
};
