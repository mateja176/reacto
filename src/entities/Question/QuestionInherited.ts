import { Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Answer } from '../Answer';
import { Questionnaire } from '../Questionnaire';
import { QuestionBase } from './QuestionBase';

@Entity()
export class QuestionInherited extends QuestionBase {
  @ManyToOne(
    () => Questionnaire,
    (questionnaire) => questionnaire.inheritedQuestions,
  )
  questionnaire: Questionnaire;
  @OneToOne(() => Answer, (answer) => answer.question)
  @JoinColumn()
  answer: Answer;
}
