import { ModelOptions, prop, Ref } from '@typegoose/typegoose';
import { AnswerClass } from '../Answer/Answer';
import { QuestionnaireClass } from '../Questionnaire/Questionnaire';
import { QuestionBase } from './QuestionBase';

@ModelOptions({ options: { customName: 'Question' } })
export class QuestionClass extends QuestionBase {
  @prop({ ref: () => QuestionnaireClass })
  public questionnaire: Ref<QuestionnaireClass>;
  @prop({ ref: () => AnswerClass })
  public answer?: Ref<AnswerClass>;
}
