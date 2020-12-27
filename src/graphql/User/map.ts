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
import { mapDoc, WithId } from '../../utils/map';
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

const getUserBase = (models: Models) => (cls: WithId<UserClass>): UserBase => {
  return {
    id: cls.id,
    email: cls.email,
    name: cls.name,
    company: createFind({
      Model: models.Company,
      map: mapCompany(models),
      ref: cls.company,
    }),
    questionnaires: createFindMany({
      Model: models.Questionnaire,
      map: mapQuestionnaire(models),
      refs: cls.questionnaires,
    }),
  };
};

export const mapAdminUserClass = (models: Models) => (
  base: UserBase,
  cls: WithId<UserClass>,
): AdminUser => {
  if (cls.questionnaireConfigurations) {
    return {
      __typename: 'AdminUser',
      ...base,
      role: AdminRole.admin,
      questionnaireConfigurations: createFindMany({
        Model: models.QuestionnaireConfiguration,
        map: mapQuestionnaireConfiguration(models),
        refs: cls.questionnaireConfigurations,
      }),
    };
  } else {
    throw new InvalidUserError();
  }
};
export const mapAdminUser = (models: Models) => (
  doc: DocumentType<UserClass>,
): AdminUser => {
  const cls = mapDoc(doc);
  return mapAdminUserClass(models)(getUserBase(models)(cls), cls);
};
export const mapRegularUserClass = (
  base: UserBase,
  _: WithId<UserClass>, // eslint-disable-line @typescript-eslint/no-unused-vars
): RegularUser => {
  return {
    __typename: 'RegularUser',
    ...base,
    role: RegularRole.regular,
  };
};
export const mapUserClass = (models: Models) => (
  cls: WithId<UserClass>,
): User => {
  const base: UserBase = getUserBase(models)(cls);
  if (cls.role === Role.admin) {
    return mapAdminUserClass(models)(base, cls);
  } else {
    return mapRegularUserClass(base, cls);
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
    company: createFind({
      Model: models.Company,
      map: mapCompany(models),
      ref: company,
    }),
  };
};
