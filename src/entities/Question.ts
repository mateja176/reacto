import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  ObjectIdColumn,
  OneToOne,
} from 'typeorm';
import { IEntity } from '../interfaces/Entity';
import { Ruled } from '../interfaces/Ruled';
import { Answer } from './Answer';
import { AnswerOption } from './AnswerOption';
import { QuestionnaireConfiguration } from './QuestionnaireConfiguration';

@Entity()
export class Question implements IEntity, Ruled {
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
  @ManyToOne(() => AnswerOption)
  options: AnswerOption[];
  @Column({
    comment:
      'Rule which when parsed determines whether to show or skip the question.',
  })
  rule?: string;
}
