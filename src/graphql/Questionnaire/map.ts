import { DocumentType } from '@typegoose/typegoose';
import { QuestionnaireClass } from '../../classes/Questionnaire/Questionnaire';
import { Questionnaire } from '../../generated/graphql';
import { mapDoc } from '../../utils/map';
import {
  createFindCompany,
  createFindQuestions,
  createFindUser,
} from '../../utils/query';
import { mapCompany } from '../Company/map';
import { mapQuestion } from '../Question/map';
import { mapUser } from '../User/map';

export const mapQuestionnaire = (
  doc: DocumentType<QuestionnaireClass>,
): Questionnaire => {
  const {
    company,
    user,
    inheritedQuestions,
    questions,
    ...questionnaire
  } = mapDoc(doc);

  return {
    __typename: 'Questionnaire',
    ...questionnaire,
    company: createFindCompany(mapCompany)(company),
    user: createFindUser(mapUser)(user),
    inheritedQuestions: createFindQuestions(mapQuestion)(inheritedQuestions),
    questions: createFindQuestions(mapQuestion)(questions),
  };
};
