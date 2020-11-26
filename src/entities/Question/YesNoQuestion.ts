import { Column, Entity, ManyToOne, ObjectIdColumn, OneToMany } from 'typeorm';
import { YesNoAnswer } from '../Answer/YesNoAnswer';
import { QuestionnaireConfiguration } from '../QuestionnaireConfiguration';
import { Question } from './Question';

@Entity()
export class YesNoQuestion implements Question {
  @ObjectIdColumn({ unique: true })
  id: string;
  @Column()
  name: string;
  @ManyToOne(
    () => QuestionnaireConfiguration,
    (questionnaireConfiguration) => questionnaireConfiguration.yesNoQuestions,
  )
  questionnaireConfiguration: QuestionnaireConfiguration;
  @OneToMany(() => YesNoAnswer, (answer) => answer.question)
  answer: YesNoAnswer[];
}
