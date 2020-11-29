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
  @Column({
    comment:
      'Rule which when parsed determines whether to show or skip the question.',
  })
  rule?: string;

  @Column({
    array: true,

    comment:
      'If the array is empty, a switch is displayed. If the array has one member a single checkbox is displayed. If the array has two members two radio buttons are displayed.',
  })
  boolean?: [] | [string] | [string, string];
  @Column()
  booleanDefault?: boolean;
  @Column({ comment: 'Textual' })
  string?: string;
  @Column()
  stringDefault?: string;
  @Column({ array: true, comment: 'Select Textual' })
  strings?: string[];
  @Column()
  stringsDefault?: string;
  @Column({ array: true, comment: 'Multi-select Textual' })
  multiStrings?: string[];
  @Column({ array: true })
  multiStringsDefault?: string[];
  @Column({ comment: 'Numerical' })
  number?: number;
  @Column()
  numberDefault?: number;
  @Column({ array: true, comment: 'Select Numerical' })
  numbers: number[];
  @Column()
  numbersDefault: number;
  @Column({ array: true, comment: 'Multi-select Numerical' })
  multiNumbers: number[];
  @Column({ array: true })
  multiNumbersDefault: number[];
}
