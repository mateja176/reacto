import { prop, Ref } from '@typegoose/typegoose';
import { Answer } from '../Answer/Answer';
import { Questionnaire } from '../Questionnaire/Questionnaire';
import { QuestionBase } from './QuestionBase';

export class Question extends QuestionBase {
  @prop({ ref: () => Questionnaire })
  public questionnaire: Ref<Questionnaire>;
  @prop({ ref: () => Answer })
  public answers: Ref<Answer>[];
}
