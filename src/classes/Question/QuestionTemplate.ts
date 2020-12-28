import {
  DocumentType,
  ModelOptions,
  pre,
  prop,
  Ref,
} from '@typegoose/typegoose';
import { questionTypes } from '../../interfaces/Type';
import { QuestionnaireConfigurationClass } from '../QuestionnaireConfiguration/QuestionnaireConfiguration';
import { QuestionBase } from './QuestionBase';

@pre('save', function (this: DocumentType<QuestionTemplateClass>) {
  const typeCount = questionTypes.reduce(
    (count, key) => (this[key] ? count + 1 : count),
    0,
  );
  if (typeCount !== 1) {
    throw new Error('Question may only have a single type.');
  }
})
@ModelOptions({
  options: { customName: 'QuestionTemplateClass' },
  schemaOptions: { minimize: false },
})
export class QuestionTemplateClass extends QuestionBase {
  @prop({ ref: () => QuestionnaireConfigurationClass })
  public questionnaireConfiguration: Ref<QuestionnaireConfigurationClass>;
}
