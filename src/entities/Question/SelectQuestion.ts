import { Column, Entity, ManyToOne, ObjectIdColumn, OneToMany } from 'typeorm';
import { SelectAnswer } from '../Answer/SelectAnswer';
import { QuestionnaireConfiguration } from '../QuestionnaireConfiguration';
import { Question } from './Question';

@Entity()
export class SelectQuestion implements Question {
  @ObjectIdColumn({ unique: true })
  id: string;
  @Column()
  name: string;
  @ManyToOne(
    () => QuestionnaireConfiguration,
    (questionnaireConfiguration) => questionnaireConfiguration.selectQuestions,
  )
  questionnaireConfiguration: QuestionnaireConfiguration;
  @OneToMany(() => SelectAnswer, (answer) => answer.question)
  answer: SelectAnswer[];
}
