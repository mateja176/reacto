import { Column, Entity, ManyToOne, ObjectIdColumn, OneToMany } from 'typeorm';
import { SelectNumberAnswer } from '../Answer/SelectNumberAnswer';
import { QuestionnaireConfiguration } from '../QuestionnaireConfiguration';
import { Question } from './Question';

@Entity()
export class SelectNumberQuestion implements Question {
  @ObjectIdColumn({ unique: true })
  id: string;
  @Column()
  name: string;
  @ManyToOne(
    () => QuestionnaireConfiguration,
    (questionnaireConfiguration) =>
      questionnaireConfiguration.selectNumberQuestions,
  )
  questionnaireConfiguration: QuestionnaireConfiguration;
  @OneToMany(() => SelectNumberAnswer, (answer) => answer.question)
  answer: SelectNumberAnswer[];
}
