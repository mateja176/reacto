import { Entity, ManyToOne } from 'typeorm';
import { Questionnaire } from '../Questionnaire';
import { QuestionBase } from './QuestionBase';

@Entity()
export class Question extends QuestionBase {
  @ManyToOne(() => Questionnaire, (questionnaire) => questionnaire.questions)
  questionnaire: Questionnaire;
}
