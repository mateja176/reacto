import { ModelOptions, prop, Ref } from '@typegoose/typegoose';
import { QuestionnaireConfigurationClass } from '../QuestionnaireConfiguration/QuestionnaireConfiguration';
import { QuestionBase } from './QuestionBase';

@ModelOptions({
  options: { customName: 'QuestionTemplateClass' },
  schemaOptions: { minimize: false },
})
export class QuestionTemplateClass extends QuestionBase {
  @prop({ ref: () => QuestionnaireConfigurationClass })
  public questionnaireConfiguration: Ref<QuestionnaireConfigurationClass>;
}
