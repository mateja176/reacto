import { prop, Ref } from '@typegoose/typegoose';
import { Answer } from '../Answer/Answer';
import { QuestionnaireConfiguration } from '../QuestionnaireConfiguration/QuestionnaireConfiguration';
import { QuestionBase } from './QuestionBase';

export class QuestionTemplate extends QuestionBase {
  @prop({ ref: QuestionnaireConfiguration })
  public questionnaireConfiguration: Ref<QuestionnaireConfiguration>;
  @prop({ ref: Answer })
  public answers: Ref<Answer>[];
}
