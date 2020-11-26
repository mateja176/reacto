import { Column, Entity, ManyToOne, ObjectIdColumn, OneToMany } from 'typeorm';
import { MultiSelectAnswer } from '../Answer/MultiSelectAnswer';
import { QuestionnaireConfiguration } from '../QuestionnaireConfiguration';
import { Question } from './Question';

@Entity()
export class MultiSelectQuestion implements Question {
  @ObjectIdColumn({ unique: true })
  id: string;
  @Column()
  name: string;
  @ManyToOne(
    () => QuestionnaireConfiguration,
    (questionnaireConfiguration) =>
      questionnaireConfiguration.multiSelectQuestions,
  )
  questionnaireConfiguration: QuestionnaireConfiguration;
  @OneToMany(() => MultiSelectAnswer, (answer) => answer.question)
  answer: MultiSelectAnswer[];
}
