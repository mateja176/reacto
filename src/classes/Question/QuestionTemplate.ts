import { ModelOptions, prop, Ref } from '@typegoose/typegoose';
import { AnswerClass } from '../Answer/Answer';
import { QuestionnaireConfigurationClass } from '../QuestionnaireConfiguration/QuestionnaireConfiguration';
import { QuestionBase } from './QuestionBase';

@ModelOptions({ options: { customName: 'QuestionTemplateClass' } })
export class QuestionTemplateClass extends QuestionBase {
  @prop({ ref: () => QuestionnaireConfigurationClass })
  public questionnaireConfiguration: Ref<QuestionnaireConfigurationClass>;
  @prop({ ref: () => AnswerClass })
  public answers: Ref<AnswerClass>[];
}
