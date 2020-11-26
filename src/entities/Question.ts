import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  ObjectIdColumn,
  OneToOne,
} from 'typeorm';
import { IEntity } from '../interfaces/Entity';
import { Answer } from './Answer';
import { AnswerOption } from './AnswerOption';
import { QuestionnaireConfiguration } from './QuestionnaireConfiguration';

@Entity()
export class Question implements IEntity {
  @ObjectIdColumn({ unique: true })
  id: string;
  @Column()
  name: string;
  @Column()
  label: string;
  @ManyToOne(
    () => QuestionnaireConfiguration,
    (questionnaireConfiguration) => questionnaireConfiguration.questions,
  )
  questionnaireConfiguration: QuestionnaireConfiguration;
  @OneToOne(() => Answer, (answer) => answer.question)
  @JoinColumn()
  answer: Answer;
  @Column(() => AnswerOption)
  option: AnswerOption;
}
