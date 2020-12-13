import { getModelForClass } from '@typegoose/typegoose';
import { AnswerClass } from '../classes/Answer/Answer';
import { CompanyClass } from '../classes/Company/Company';
import { QuestionClass } from '../classes/Question/Question';
import { QuestionTemplateClass } from '../classes/Question/QuestionTemplate';
import { QuestionnaireClass } from '../classes/Questionnaire/Questionnaire';
import { QuestionnaireConfigurationClass } from '../classes/QuestionnaireConfiguration/QuestionnaireConfiguration';
import { UserClass } from '../classes/User/User';
import { UserPendingClass } from '../classes/User/UserPending';

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
