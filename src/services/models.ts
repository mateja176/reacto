import { getModelForClass, mongoose } from '@typegoose/typegoose';
import { AnswerClass } from '../classes/Answer/Answer';
import { CompanyClass } from '../classes/Company/Company';
import { QuestionClass } from '../classes/Question/Question';
import { QuestionTemplateClass } from '../classes/Question/QuestionTemplate';
import { QuestionnaireClass } from '../classes/Questionnaire/Questionnaire';
import { QuestionnaireConfigurationClass } from '../classes/QuestionnaireConfiguration/QuestionnaireConfiguration';
import { PendingUserClass } from '../classes/User/PendingUser';
import { UserClass } from '../classes/User/User';

export const createModels = (connection: mongoose.Connection) => {
  return {
    Company: getModelForClass(CompanyClass, {
      existingConnection: connection,
    }),
    User: getModelForClass(UserClass, {
      existingConnection: connection,
    }),
    PendingUser: getModelForClass(PendingUserClass, {
      existingConnection: connection,
    }),
    QuestionnaireConfiguration: getModelForClass(
      QuestionnaireConfigurationClass,
    ),
    Questionnaire: getModelForClass(QuestionnaireClass, {
      existingConnection: connection,
    }),
    Question: getModelForClass(QuestionClass, {
      existingConnection: connection,
    }),
    QuestionTemplate: getModelForClass(QuestionTemplateClass, {
      existingConnection: connection,
    }),
    Answer: getModelForClass(AnswerClass, {
      existingConnection: connection,
    }),
  };
};
export type Models = ReturnType<typeof createModels>;
