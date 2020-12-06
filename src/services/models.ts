import { getModelForClass } from '@typegoose/typegoose';
import { Answer } from '../entities/Answer/Answer';
import { Company } from '../entities/Company/Company';
import { Question } from '../entities/Question/Question';
import { QuestionTemplate } from '../entities/Question/QuestionTemplate';
import { Questionnaire } from '../entities/Questionnaire/Questionnaire';
import { QuestionnaireConfiguration } from '../entities/QuestionnaireConfiguration/QuestionnaireConfiguration';
import { User } from '../entities/User/User';
import { UserPending } from '../entities/User/UserPending';

export const CompanyModel = getModelForClass(Company);
export const UserModel = getModelForClass(User);
export const UserPendingModel = getModelForClass(UserPending);
export const QuestionnaireConfigurationModel = getModelForClass(
  QuestionnaireConfiguration,
);
export const QuestionnaireModel = getModelForClass(Questionnaire);
export const QuestionModel = getModelForClass(Question);
export const QuestionTemplateModel = getModelForClass(QuestionTemplate);
export const AnswerModel = getModelForClass(Answer);
