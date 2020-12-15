import { DocumentType } from '@typegoose/typegoose';
import { PendingUserClass } from '../../classes/User/PendingUser';
import { Role, UserClass } from '../../classes/User/User';
import {
  AdminRole,
  AdminUser,
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

class InvalidUserError extends Error {
  constructor() {
    super('Invalid user.');
  }
}

export type UserBase = Pick<
  User,
  'id' | 'email' | 'name' | 'company' | 'questionnaires'
>;

const getUserBase = (cls: MapClass<UserClass>): UserBase => {
  return {
    id: cls.id,
    email: cls.email,
    name: cls.name,
    company: createFindCompany(mapCompany)(cls.company),
    questionnaires: createFindQuestionnaires(mapQuestionnaire)(
      cls.questionnaires,
    ),
  };
};

export const mapAdminUserClass = (
  cls: MapClass<UserClass>,
  base: UserBase,
): AdminUser => {
  if (cls.questionnaireConfigurations) {
    return {
      __typename: 'AdminUser',
      ...base,
      role: AdminRole.admin,
      questionnaireConfigurations: createFindQuestionnaireConfigurations(
        mapQuestionnaireConfiguration,
      )(cls.questionnaireConfigurations),
    };
  } else {
    throw new InvalidUserError();
  }
};
export const mapAdminUser = (doc: DocumentType<UserClass>): AdminUser => {
  const cls = mapDoc(doc);
  return mapAdminUserClass(cls, getUserBase(cls));
};
export const mapRegularUserClass = (
  _: MapClass<UserClass>,
  base: UserBase,
): RegularUser => {
  return {
    __typename: 'RegularUser',
    ...base,
    role: RegularRole.regular,
  };
};
export const mapUserClass = (cls: MapClass<UserClass>): User => {
  const base: UserBase = getUserBase(cls);
  if (cls.role === Role.admin) {
    return mapAdminUserClass(cls, base);
  } else {
    return mapRegularUserClass(cls, base);
  }
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
    __typename: 'PendingUser',
    ...pendingUser,
    company: createFindCompany(mapCompany)(company),
  };
};
