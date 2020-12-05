import { Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Questionnaire } from '../../Questionnaire';
import { Answer } from './entities/Answer';
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
