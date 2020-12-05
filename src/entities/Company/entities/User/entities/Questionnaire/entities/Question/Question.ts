import { Column, Entity } from 'typeorm';
import { Answer } from './entities/Answer';
import { QuestionTemplate } from './QuestionTemplate';

@Entity()
export class Question extends QuestionTemplate {
  @Column(() => Answer)
  answer: Answer;
}
