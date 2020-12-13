import { getModelForClass } from '@typegoose/typegoose';
import { AnswerClass } from '../entities/Answer/Answer';
import { CompanyClass } from '../entities/Company/Company';
import { QuestionClass } from '../entities/Question/Question';
import { QuestionTemplateClass } from '../entities/Question/QuestionTemplate';
import { QuestionnaireClass } from '../entities/Questionnaire/Questionnaire';
import { QuestionnaireConfigurationClass } from '../entities/QuestionnaireConfiguration/QuestionnaireConfiguration';
import { UserClass } from '../entities/User/User';
import { UserPendingClass } from '../entities/User/UserPending';

export const CompanyModel = getModelForClass(CompanyClass);
export const UserModel = getModelForClass(UserClass);
export const UserPendingModel = getModelForClass(UserPendingClass);
export const QuestionnaireConfigurationModel = getModelForClass(
  QuestionnaireConfigurationClass,
);
export const QuestionnaireModel = getModelForClass(QuestionnaireClass);
export const QuestionModel = getModelForClass(QuestionClass);
export const QuestionTemplateModel = getModelForClass(QuestionTemplateClass);
export const AnswerModel = getModelForClass(AnswerClass);
