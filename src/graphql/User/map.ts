import { DocumentType } from '@typegoose/typegoose';
import { PendingUserClass } from '../../classes/User/PendingUser';
import { UserClass } from '../../classes/User/User';
import {
  AdminRole,
  PendingUser,
  RegularRole,
  RegularUser,
  User,
} from '../../generated/graphql';
import { MapClass, mapDoc } from '../../utils/map';
import {
  createFindCompany,
  createFindQuestionnaireConfigurations,
  createFindQuestionnaires,
} from '../../utils/query';
import { mapCompany } from '../Company/map';
import { mapQuestionnaire } from '../Questionnaire/map';
import { mapQuestionnaireConfiguration } from '../QuestionnaireConfiguration/map';

export const mapUserClass = (cls: MapClass<UserClass>): User => {
  const {
    id,
    passwordHash, // eslint-disable-line @typescript-eslint/no-unused-vars
    company,
    questionnaires,
    questionnaireConfigurations,
    ...user
  } = cls;

  const userBase = {
    id,
    ...user,
    company: createFindCompany(mapCompany)(company),
    questionnaires: createFindQuestionnaires(mapQuestionnaire)(questionnaires),
  };

  const regularUser: RegularUser = {
    ...userBase,
    role: RegularRole.regular,
  };

  return questionnaireConfigurations
    ? {
        ...userBase,
        role: AdminRole.admin,
        questionnaireConfigurations: createFindQuestionnaireConfigurations(
          mapQuestionnaireConfiguration,
        )(questionnaireConfigurations),
      }
    : regularUser;
};
export const mapUser = (doc: DocumentType<UserClass>): User => {
  const userClass = mapDoc(doc);

  return mapUserClass(userClass);
};

export const mapPendingUser = (
  doc: DocumentType<PendingUserClass>,
): PendingUser => {
  const { company, ...pendingUser } = mapDoc(doc);

  return {
    ...pendingUser,
    company: createFindCompany(mapCompany)(company),
  };
};
