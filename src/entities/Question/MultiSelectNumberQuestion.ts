import { Column, Entity, ManyToOne, ObjectIdColumn, OneToMany } from 'typeorm';
import { MultiSelectNumberAnswer } from '../Answer/MultiSelectNumberAnswer';
import { QuestionnaireConfiguration } from '../QuestionnaireConfiguration';
import { Question } from './Question';

@Entity()
export class MultiSelectNumberQuestion implements Question {
  @ObjectIdColumn({ unique: true })
  id: string;
  @Column()
  name: string;
  @ManyToOne(
    () => QuestionnaireConfiguration,
    (questionnaireConfiguration) =>
      questionnaireConfiguration.multiSelectNumberQuestions,
  )
  questionnaireConfiguration: QuestionnaireConfiguration;
  @OneToMany(() => MultiSelectNumberAnswer, (answer) => answer.question)
  answer: MultiSelectNumberAnswer[];
}
