import { Column, Entity, ManyToOne, ObjectIdColumn, OneToMany } from 'typeorm';
import { MultiFileAnswer } from '../Answer/MultiFileAnswer';
import { QuestionnaireConfiguration } from '../QuestionnaireConfiguration';
import { Question } from './Question';

@Entity()
export class MultiFileQuestion implements Question {
  @ObjectIdColumn({ unique: true })
  id: string;
  @Column()
  name: string;
  @ManyToOne(
    () => QuestionnaireConfiguration,
    (questionnaireConfiguration) =>
      questionnaireConfiguration.multiFileQuestions,
  )
  questionnaireConfiguration: QuestionnaireConfiguration;
  @OneToMany(() => MultiFileAnswer, (answer) => answer.question)
  answer: MultiFileAnswer[];
}
