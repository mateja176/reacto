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
import { Models } from '../../services/models';
import { MapClass, mapDoc } from '../../utils/map';
import { createFind, createFindMany } from '../../utils/query';
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

const getUserBase = (models: Models) => (
  cls: MapClass<UserClass>,
): UserBase => {
  return {
    id: cls.id,
    email: cls.email,
    name: cls.name,
    company: createFind(models.Company)(mapCompany(models))(cls.company),
    questionnaires: createFindMany(models.Questionnaire)(
      mapQuestionnaire(models),
    )(cls.questionnaires),
  };
};

export const mapAdminUserClass = (models: Models) => (
  cls: MapClass<UserClass>,
  base: UserBase,
): AdminUser => {
  if (cls.questionnaireConfigurations) {
    return {
      __typename: 'AdminUser',
      ...base,
      role: AdminRole.admin,
      questionnaireConfigurations: createFindMany(
        models.QuestionnaireConfiguration,
      )(mapQuestionnaireConfiguration(models))(cls.questionnaireConfigurations),
    };
  } else {
    throw new InvalidUserError();
  }
};
export const mapAdminUser = (models: Models) => (
  doc: DocumentType<UserClass>,
): AdminUser => {
  const cls = mapDoc(doc);
  return mapAdminUserClass(models)(cls, getUserBase(models)(cls));
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
export const mapUserClass = (models: Models) => (
  cls: MapClass<UserClass>,
): User => {
  const base: UserBase = getUserBase(models)(cls);
  if (cls.role === Role.admin) {
    return mapAdminUserClass(models)(cls, base);
  } else {
    return mapRegularUserClass(cls, base);
  }
};
export const mapUser = (models: Models) => (
  doc: DocumentType<UserClass>,
): User => {
  const userClass = mapDoc(doc);

  return mapUserClass(models)(userClass);
};

export const mapPendingUser = (models: Models) => (
  doc: DocumentType<PendingUserClass>,
): PendingUser => {
  const { company, ...pendingUser } = mapDoc(doc);

  return {
    __typename: 'PendingUser',
    ...pendingUser,
    company: createFind(models.Company)(mapCompany(models))(company),
  };
};
