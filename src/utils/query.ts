import { DocumentType, Ref, ReturnModelType } from '@typegoose/typegoose';
import { AnyParamConstructor } from '@typegoose/typegoose/lib/types';
import { Node } from '../generated/graphql';
import { Class } from '../interfaces/Class';
import {
  AnswerModel,
  CompanyModel,
  PendingUserModel,
  QuestionModel,
  QuestionnaireConfigurationModel,
  QuestionnaireModel,
  QuestionTemplateModel,
  UserModel,
} from '../services/models';
import { NotFoundError } from './errors';

export const createFind = <C extends Class>(
  Model: ReturnModelType<AnyParamConstructor<C>>,
) => <N extends Node>(map: (cls: DocumentType<C>) => N) => (
  ref: Ref<C>,
) => async () => {
  const doc = await Model.findById(ref);
  if (!doc) {
    throw new NotFoundError();
  }

  return map(doc);
};
export const createFindMany = <C extends Class>(
  Model: ReturnModelType<AnyParamConstructor<C>>,
) => <N extends Node>(map: (cls: DocumentType<C>) => N) => (
  refs: Ref<C>[],
) => async () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const docs = await Model.find({ _id: { $in: refs } } as any);

  return docs.map(map);
};

export const createFindCompany = createFind(CompanyModel);
export const createFindUser = createFind(UserModel);
export const createFindPendingUser = createFind(PendingUserModel);
export const createFindQuestionnaireConfiguration = createFind(
  QuestionnaireConfigurationModel,
);
export const createFindQuestionnaire = createFind(QuestionnaireModel);
export const createFindQuestion = createFind(QuestionModel);
export const createFindQuestionTemplate = createFind(QuestionTemplateModel);
export const createFindAnswer = createFind(AnswerModel);

export const createFindCompanies = createFindMany(CompanyModel);
export const createFindUsers = createFindMany(UserModel);
export const createFindPendingUsers = createFindMany(PendingUserModel);
export const createFindQuestionnaireConfigurations = createFindMany(
  QuestionnaireConfigurationModel,
);
export const createFindQuestionnaires = createFindMany(QuestionnaireModel);
export const createFindQuestions = createFindMany(QuestionModel);
export const createFindQuestionTemplates = createFindMany(
  QuestionTemplateModel,
);
export const createFindAnswers = createFindMany(AnswerModel);
