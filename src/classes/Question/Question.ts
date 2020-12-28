import {
  DocumentType,
  ModelOptions,
  pre,
  prop,
  Ref,
} from '@typegoose/typegoose';
import { questionTypes } from '../../interfaces/Type';
import { AnswerClass } from '../Answer/Answer';
import { QuestionnaireClass } from '../Questionnaire/Questionnaire';
import { QuestionBase } from './QuestionBase';

@pre('save', function (this: DocumentType<QuestionClass>) {
  const typeCount = questionTypes.reduce(
    (count, key) => (this[key] ? count + 1 : count),
    0,
  );
  if (typeCount !== 1) {
    throw new Error('Question may only have a single type.');
  }
})
@ModelOptions({
  options: { customName: 'Question' },
  schemaOptions: { minimize: false },
})
export class QuestionClass extends QuestionBase {
  @prop({ ref: () => QuestionnaireClass })
  public questionnaire: Ref<QuestionnaireClass>;
  @prop({ ref: () => AnswerClass })
  public answer?: Ref<AnswerClass>;
}
